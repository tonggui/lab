import { AuditProductInfo } from '@/data/interface/product'
import { BaseCategory } from '@/data/interface/category'
import { Brand } from '@/data/interface/common'

export const convertAuditProductInfo = (info: any): AuditProductInfo => {
  const category: BaseCategory = {
    id: info.categoryId,
    name: info.category.name,
    idPath: [], // TODO
    namePath: [] // TODO
  }
  const brand: Brand = {
    name: info.brandName,
    id: info.brandId
  }
  return {
    processId: info.processId,
    auditStatus: info.auditStatus,
    cTime: info.createTime,
    uTime: info.lastUpdateTime,
    auditor: info.auditer,
    source: info.source,
    id: info.productId,
    name: info.name,
    pictureList: info.pictureList,
    upcCode: info.upc,
    category,
    brand
  }
}

export const convertAuditProductInfoList = (list) => (list || []).map(convertAuditProductInfo)