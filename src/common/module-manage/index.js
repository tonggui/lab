import {
  fetchGetWhiteListModuleMap,
  fetchGetListPageData,
  fetchGetPoiHotRecommend,
  fetchGetPoiViolationInfo,
  fetchGetPoiRiskControl
} from '@/data/repos/poi'

import ModuleManage from './manage'

const instance = new ModuleManage({
  context: { path: 'aaaa' },
  source: {
    whiteList: fetchGetWhiteListModuleMap,
    listPage: fetchGetListPageData,
    hotRecommend: fetchGetPoiHotRecommend,
    poiViolationInfo: fetchGetPoiViolationInfo,
    poiRiskControl: fetchGetPoiRiskControl,
    test: () => 'test'
  },
  module: {
    test: {
      source: 'test',
      defaultValue: 'default',
      handler: (data) => `felid-${data}`
    }
  }
})
export default instance
