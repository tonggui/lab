import memoize from 'memoize-one'
import { fetchGetPoiIsMedicineMerchant } from '@/data/repos/medicineMerchantPoi'
import { fetchPageEnvInfo } from '@/data/repos/common'
import { getCookie } from '@utiljs/cookie'

export const some = (fn, defaultValue = false) => (list) => {
  if (list.length <= 0) {
    return defaultValue
  }
  return list.some(fn)
}
export const every = (fn, defaultValue = false) => (list) => {
  if (list.length <= 0) {
    return defaultValue
  }
  return list.every(fn)
}

/**
 * 判断是否为典型药品品类商家
 * @param categoryId
 * @returns {boolean}
 */
export const checkIsMedicineById = categoryId => [179, 180].includes(categoryId)

/**
 * 药品品类判断
 * 一级经营品类 22，二级经营品类 [179， 180， 181] 中的一个
 * 只有179(OTC),180(中药),181(保健品)走药品逻辑，受到药品控制
 * !!!调整181(保健品)为商超 https://ones.sankuai.com/ones/product/9550/workItem/task/detail/9005456
 * @param {*} category
 */
export const isMedicineBusiness = category => category.pid === 22 && checkIsMedicineById(category.id)

export const isMedicineAccount = (categoryList, routerTagId) => {
  if (categoryList && categoryList.length > 0) {
    return some(category => isMedicineBusiness(category))(categoryList)
  }
  return (+routerTagId) === 22
}

export const getProductNameExample = (category) => {
  /**
   * 根据门店主营一级品类判断
   * 主营一级品类：水果、食材，按照生鲜类展示
   * 主营一级品类：超市便利、宠物、食品专营、日用百货、美妆日化、母婴，按照超市类展示
   * 主营一级品类：服饰鞋帽，按照服饰类展示
   * 主营一级品类：医药健康，按照医药类展示
   * 主营一级品类：鲜花绿植，按照鲜花类展示
   * 具体展示文案
   * 超市类：参考格式：品牌+商品简称+售卖规格
   * 生鲜类：参考格式：产地+品种+商品简称+售卖规格
   * 医药类：参考格式：品牌+通用名+售卖规格
   * 鲜花类：参考格式：花语+朵数+主花材+款式
   * 服装类：参考格式：品牌+商品简称+售卖规格
  */
  const list = [{
    pidList: [10000000, 11000000],
    name: '产地+品种+商品简称+售卖规格'
  }, {
    pidList: [
      13000000, // 超市便利
      12000000, // 宠物
      14000000, // 食品专营
      15000000, // 日用百货
      5007, // 美妆日化
      5018 // 母婴
    ],
    name: '品牌+商品简称+售卖规格'
  }, {
    pidList: [5001], // 服饰衣帽
    name: '品牌+商品简称+售卖规格'
  }, {
    pidList: [22], // 医药健康
    name: '品牌+通用名+售卖规格'
  }, {
    pidList: [1001], // 鲜花绿植
    name: '花语+朵数+主花材+款式'
  }]
  const { pid } = category
  const item = list.find(({ pidList }) => pidList.includes(+pid))
  return (item || {}).name || ''
}

export const isAssociateMedicineMerchant = memoize(() => {
  return fetchGetPoiIsMedicineMerchant().catch((e) => {
    console.error(`获取门店是否关联医药商家商品中心失败: ${e}`)
    return false
  })
})

export const isMedicinePoild = memoize(() => {
  const poiId = getCookie('wmPoiId')
  // 医药健康二级经营品类id
  const medicineIdList = [
    6006, // 医疗器械店
    4012, // 成人/情趣用品店
    179, // 综合药店
    180, // 中药店
    181, // 营养保健品店，（PS：保健品走商超逻辑，但在产品业务层，还是属于药品类，不是零售类）
    6005 // 眼镜店
  ]
  return fetchPageEnvInfo({ poiId }).then((data) => {
    console.log(data)
    const tags = data.poiTags
    if (tags && Array.isArray(tags)) {
      return tags.some(tag => medicineIdList.indexOf(tag.id) > -1)
    }
  }).catch((e) => {
    console.error(`获取门店是否是医药门店失败: ${e}`)
    return false
  })
})
