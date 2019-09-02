import {
  fetchGetWhiteListModuleMap,
  fetchGetListPageData,
  fetchGetPoiHotRecommend,
  fetchGetPoiViolationInfo,
  fetchGetPoiRiskControl
} from '@/data/repos/poi'

import SourceManage from './source'
import Module from './module'

const sourceManageInstance = new SourceManage({
  whiteList: fetchGetWhiteListModuleMap,
  listPage: fetchGetListPageData,
  hotRecommend: fetchGetPoiHotRecommend,
  poiViolationInfo: fetchGetPoiViolationInfo,
  poiRiskControl: fetchGetPoiRiskControl,
  test: () => 'test'
})
const module = new Module({
  test: {
    source: sourceManageInstance.getSource('test'),
    defaultValue: 'default'
  }
})

console.log('module:', sourceManageInstance, module)

export const mapModule = (map) => {
  return Object.entries(map).reduce((prev, [key, felid]) => {
    const f = felid || key
    prev[key] = () => module.getFelid(f)
    return prev
  }, {})
}

export default module
