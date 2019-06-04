import client from '../client'
import {
  WHITELIST_MODULES_MAP
} from '../enums/fields'

/**
 * 获取门店类型
 * 1.商超&成人用品；2.果蔬生鲜；3.其他；4.服装鞋帽；5.美妆；6.日用品；7.母婴；
 * @param poiId 门店ID
 * @returns {*}
 */
export const fetchPoiType = params =>
  client.post('retail/r/marketTagInfo', params).then(data => {
    data.showSubmitPic = !!data.showSubmitPic
    return data
  })

/**
 * 获取店内分类列表
 * @param poiId
 * @returns {*}
 */
export const fetchTagList = params =>
  client.post('retail/r/tagList', params).then(data => data || {})

/**
 * 获取模块功能的白名单配置信息
 * @param poiId 门店ID
 * @return {*}
 */
export const fetchWhiteListModules = () => client
  .post('retail/r/getWhiteListByPoiIdAndType', {})
  .then(({ whiteList = [] }) => {
    const map = {}
    whiteList.forEach((item) => {
      const key = WHITELIST_MODULES_MAP[item.type]
      if (key) {
        map[key] = item.status === 1
      }
    })
    return map
  })
