import httpClient from '../client/instance/product'
import { MedicineAuditStandardProduct } from '@/data/interface/product'

/**
 * 药品审核灰度开关
 */
export const isAuditApplyEnabled = ({
  poiId
}: { poiId: string }) => httpClient.post('shangou/medicine/audit/r/spAuditGray', {
  wmPoiId: poiId
}).then((data = {}) => !!data.spAuditGray)

/**
 * 标品申请信息详情
 */
export const spAuditDetail = ({
  poiId,
  spId
}: {
  poiId: string | number,
  spId: number | string,
}) => httpClient.post('shangou/medicine/audit/r/detailAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0
})

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
  ...product
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
}) => httpClient.post('shangou/medicine/audit/r/commitAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0,
  ...product
})

// 取消审核申请
export const cancelAuditSp = ({
  spId
}: {
  spId: number | string,
}) => httpClient.post('shangou/medicine/audit/r/cancelAuditSp', {
  spSkuId: spId || 0
})
