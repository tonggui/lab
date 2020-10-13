import { PoiInfo } from '../../interface/poi'
import { PRODUCT_AUDIT_STATUS } from '../../enums/product'

export const convertPoi = (poi: any): PoiInfo => {
  const node: PoiInfo = {
    id: poi.id || poi.wmPoiId || poi.poiId,
    name: poi.name || poi.wmPoiName || '',
    address: poi.address,
    brand: {
      id: poi.brandId || poi.wmPoiBrandId,
      name: poi.brandName || poi.wmPoiBrand || ''
    },
    owner: {
      id: poi.ownerUid,
      name: poi.ownerName || poi.owner || ''
    }
  }
  return node
}

export const convertPoiList = (list: any[]): PoiInfo[] => {
  list = list || []
  return list.map(convertPoi)
}

export const convertAuditStatistics = (data: any) => {
  data = data || {}
  return {
    [PRODUCT_AUDIT_STATUS.ALL_NOT_PASS]: data.allAuditingSp || 0,
    [PRODUCT_AUDIT_STATUS.SP_UNAUDIT]: data.unCommitAudit || 0,
    [PRODUCT_AUDIT_STATUS.AUDITING]: data.auditing || 0,
    [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: data.reject || 0,
    [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]: data.pass || 0,
    [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: data.cancel || 0,
    [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: data.auditReject || 0
  }
}
