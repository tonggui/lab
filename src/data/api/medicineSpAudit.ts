import _ from 'lodash'
import httpClient from '../client/instance/product'
import { MedicineAuditStandardProduct, SpAuditProductInfo } from '@/data/interface/product'
import { BaseCategory, CategoryAttr, StandardProductCategoryAttrValue } from '@/data/interface/category'
import { Pagination } from '@/data/interface/common'
import { RENDER_TYPE, SPECIAL_CATEGORY_ATTR, VALUE_TYPE } from '@/data/enums/category'
import { trimSplit, trimSplitId } from '@/common/utils'
import { getCategoryAttrs } from '@/data/api/medicine'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  AuditTriggerMode,
  PRODUCT_AUDIT_STATUS
} from '@/data/enums/product'

const convertCategoryToServer = (categoryAttrValueMap, categoryAttrList: CategoryAttr[]) => {
  const result: StandardProductCategoryAttrValue[] = []
  Object.entries(categoryAttrValueMap || {})
    .forEach(([key, value]: [string, number | string | number[] | any]) => {
      const attr = categoryAttrList.find((attr: CategoryAttr) => attr.id === +key)
      if (attr) {
        const item: StandardProductCategoryAttrValue = {
          attrId: attr.id,
          attrName: attr.name,
          isExt: attr.valueType === VALUE_TYPE.INPUT ? 1 : 2,
          extension: '',
          valueId: 0
        }
        if (attr.valueType === VALUE_TYPE.INPUT) {
          item.extension = `${value || ''}`
        } else if (attr.render.type === RENDER_TYPE.BRAND) {
          item.valueId = +((value && value.idPath) || [])[0] || 0
          item.extension = ((value && value.namePath) || [])[0] || ''
        } else {
          item.valueId = +value
        }
        result.push(item)
      }
    })
  return result
}

const convertSpInfoToServer = (product: MedicineAuditStandardProduct) => {
  const {
    category, tagList, pictureList, pictureDetailList,
    categoryAttrList, categoryAttrValueMap,
    ...others
  } = product

  const attrValueList = convertCategoryToServer(categoryAttrValueMap, categoryAttrList || [])
  if (product.spId) {
    _.forEach(attrValueList, attrValue => {
      attrValue.spSkuId = product.spId
    })
  }

  return {
    // category: {
    //   id: category.id,
    //   categoryName: category.name,
    //   idPath: _.join(category.idPath, ','),
    //   namePath: _.join(category.namePath, ',')
    // },
    categoryId: category.id,
    medicineTags: JSON.stringify(tagList),
    pics: JSON.stringify(pictureList),
    picDetails: JSON.stringify(pictureDetailList),
    attrValues: JSON.stringify(attrValueList),
    upcs: JSON.stringify(others.upcList),
    ..._.pick(others, ['name', 'spec', 'suggestedPrice', 'type'])
  }
}

const convertCategoryFromServer = (category: any): BaseCategory => {
  category = category || {}
  const node: BaseCategory = {
    id: category.categoryId,
    name: category.categoryName,
    idPath: trimSplitId(category.idPath),
    namePath: trimSplit(category.categoryNamePath)
  }
  return node
}

const convertAuditProductVo = async (standardProductVo: any, poiId: number | string, spId: number | string) => {
  const valueMap = {}
  let categoryAttrList: CategoryAttr[] = []
  if (standardProductVo.category) {
    categoryAttrList = await getCategoryAttrs({ poiId, categoryId: standardProductVo.category.categoryId }, true)
    const attrValueList = standardProductVo.attrValueList || []
    // 清洗支持自定义扩展的数据，清除已选择数据，将数据设置到attrList中，同时设置valueMap
    for (const attrValueItem of attrValueList) {
      const categoryAttrItem = categoryAttrList.find(categoryAttrItem => categoryAttrItem.id === attrValueItem.attrId)
      if (!categoryAttrItem) {
        // 如果未找到对应的类目属性，则过滤属性
        continue
      }
      let value
      if (categoryAttrItem.id === SPECIAL_CATEGORY_ATTR.BRAND) {
        value = {
          id: +attrValueItem.valueId || 0,
          name: attrValueItem.extension || '',
          idPath: [+attrValueItem.valueId || 0],
          namePath: [attrValueItem.extension || '']
        }
      } else {
        switch (categoryAttrItem.valueType) {
          case VALUE_TYPE.INPUT:
            value = attrValueItem.extension
            break
          case VALUE_TYPE.SINGLE_SELECT:
            value = +attrValueItem.valueId || 0
            break
          case VALUE_TYPE.MULTI_SELECT:
            value = _.map(_.split(attrValueItem.valueId, ','), v => +v || 0)
            break
        }
      }
      valueMap[categoryAttrItem.id] = value
    }
  }
  const spProduct: MedicineAuditStandardProduct = {
    spId: +spId,
    name: standardProductVo.name,
    category: convertCategoryFromServer(standardProductVo.category),
    upcList: _.defaultTo(standardProductVo.upcList, []),
    spec: _.defaultTo(standardProductVo.spec, ''),
    suggestedPrice: _.defaultTo(standardProductVo.suggestedPrice, 0),
    tagList: _.defaultTo(standardProductVo.medicineTagList, []),
    pictureList: _.defaultTo(standardProductVo.picList, []),
    pictureDetailList: _.defaultTo(standardProductVo.picDetailList, [])
  }
  return { spProduct, categoryAttrList, valueMap }
}

/**
 * 药品审核灰度开关
 * 改为返回两个字段：auditGray（商品审核）、spAuditGray（商品审核（标品））
 */
export const isAuditApplyEnabled = ({
  poiId
}: { poiId: string }) => httpClient.post('shangou/medicine/audit/r/spAuditGray', {
  wmPoiId: poiId
}).then((data = {}) => data)

/**
 * 标品申请信息详情
 */
export const spAuditDetail = async ({
  poiId,
  spId
}: {
  poiId: string | number,
  spId: number | string,
}) => {
  const { standardProductVo, tasks, originStandardProductVo } = await httpClient.post('shangou/medicine/audit/r/detailAuditSp', {
    wmPoiId: poiId,
    spSkuId: spId || 0
  })
  const { spProduct, categoryAttrList, valueMap } = await convertAuditProductVo(standardProductVo, poiId, spId)
  let originSpProduct = originStandardProductVo
  if (originStandardProductVo) {
    const { spProduct, categoryAttrList: originCategoryAttrList, valueMap: originValueMap } = await convertAuditProductVo(originStandardProductVo, poiId, spId)
    originSpProduct = {
      ...spProduct,
      categoryAttrValueMap: originValueMap,
      categoryAttrList: originCategoryAttrList
    }
  }
  return {
    tasks,
    ...spProduct,
    originSpProduct,
    auditStatus: +standardProductVo.auditStatus || 0,
    categoryAttrValueMap: valueMap,
    // 医药标品提报-过滤销售属性（销售属性只应用在商品，不在标品库中维护，因此在标品提报时上传销售属性无意义）
    // 查看已提报标品详情-过滤销售属性，同标品提报逻辑
    categoryAttrList: categoryAttrList.filter((attr) => attr.attrType !== 2),
    wmPoiId: standardProductVo.wmPoiId
  }
}

// 新建/更新标品信息
export const saveOrUpdateSpInfo = ({
  poiId,
  spId,
  product
}: {
  poiId: string | number,
  spId: number | string,
  product: MedicineAuditStandardProduct,
}) => httpClient.post('shangou/medicine/audit/w/saveAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0,
  ...convertSpInfoToServer(product)
})

// 提交/重新提交标品申请
export const commitAuditSp = ({
  poiId,
  spId,
  product
}: {
  poiId: string | number,
  spId: number | string,
  product: MedicineAuditStandardProduct,
}) => httpClient.post('shangou/medicine/audit/w/commitAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0,
  ...convertSpInfoToServer(product)
})

// 取消审核申请
// type:是否为医药纠错标品
export const cancelAuditSp = ({
  poiId,
  spId,
  type
}: {
  poiId: number | string,
  spId: number | string,
  type: number | string
}) => httpClient.post('shangou/medicine/audit/w/cancelAuditSp', {
  spSkuId: spId || 0,
  wmPoiId: poiId,
  type: type || 0
})

export const submitDeleteSpAudit = ({ spId, poiId } : { spId: number, poiId: number }) => httpClient.post('shangou/medicine/audit/w/deleteAuditSp', {
  spSkuId: spId,
  wmPoiId: poiId
})

export const getAuditSpList = ({ poiId, pagination, searchWord, auditStatus } : {
  poiId: number,
  pagination: Pagination,
  searchWord: string,
  auditStatus: PRODUCT_AUDIT_STATUS[]
}) => httpClient.post('shangou/medicine/audit/r/listAuditSp', {
  wmPoiId: poiId,
  auditStatus: auditStatus.filter(item => item !== PRODUCT_AUDIT_STATUS.ALL_NOT_PASS),
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  searchWord: searchWord || '',
  // TODO: 如果是 全量未审核通过商品（后台接口的原因） ，则需要 填加 新字段 isAllNotPass
  isAllNotPass: !!(auditStatus.indexOf(PRODUCT_AUDIT_STATUS.ALL_NOT_PASS) > -1)
}).then(data => {
  const { totalCount, standardProductList = [] } = (data || {}) as any
  return {
    pagination: {
      ...pagination,
      total: totalCount || 0
    },
    list: (standardProductList || []).map(product => {
      console.log(product.wmPoiId, poiId)
      const node: SpAuditProductInfo = {
        id: product.spSkuId,
        name: product.name,
        pictureList: product.picList,
        upcCode: product.upcList ? product.upcList[0] : '',
        auditStatus: product.auditStatus,
        category: convertCategoryFromServer(product.category),
        ctime: product.ctime || undefined,
        auditUpdateTime: product.auditUpdateTime || undefined,
        triggerMode: AuditTriggerMode.UNKNOWN,
        hasModifiedByAuditor: false,
        recoverySymbol: product.recoverySymbol || 0,
        detailSymbol: product.detailSymbol || 0,
        wmPoiId: product.wmPoiId
      }
      return node
    })
  }
})

export const getAuditSpSearchSuggestion = ({ poiId, keyword, auditStatus }: { poiId: number, keyword: string, auditStatus: PRODUCT_AUDIT_STATUS[] }) => httpClient.post('shangou/medicine/audit/r/sugAuditSp', {
  searchWord: keyword,
  wmPoiId: poiId,
  auditStatus: auditStatus.filter(item => item !== PRODUCT_AUDIT_STATUS.ALL_NOT_PASS),
  // TODO: 如果是 全量未审核通过商品（后台接口的原因） ，则需要 填加 新字段 isAllNotPass
  isAllNotPass: !!(auditStatus.indexOf(PRODUCT_AUDIT_STATUS.ALL_NOT_PASS) > -1)

}).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})
