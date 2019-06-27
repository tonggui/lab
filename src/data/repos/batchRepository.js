import {
  fetchRouterInfo as apiRouterInfo
} from '../api/batchApi'

export const fetchRouterInfo = params => apiRouterInfo(params).then(({ routerTagInfo, singlePoiTagFlag }) => ({
  ...routerTagInfo,
  singlePoiTagFlag: !!singlePoiTagFlag
}))
