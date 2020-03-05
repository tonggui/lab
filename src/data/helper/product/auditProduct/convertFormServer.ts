import { AuditProductInfo } from '@/data/interface/product'
import { BaseCategory } from '@/data/interface/category'
import { Brand } from '@/data/interface/common'

export const convertAuditProductInfo = (info: any): AuditProductInfo => {
  const category: BaseCategory = {
    id: info.categoryId,
    name: info.categoryName,
    idPath: [], // TODO
    namePath: (info.categoryNamePath || '').split(',') // TODO
  }
  const brand: Brand = {
    name: info.brandName,
    id: info.brandId
  }
  return {
    processId: info.processId,
    auditStatus: info.auditStatus,
    ctime: info.createTime,
    utime: info.lastUpdateTime,
    auditor: info.auditer,
    source: info.source,
    id: info.productId,
    name: info.name,
    pictureList: (info.pictures || '').split(','),
    upcCode: info.upc,
    category,
    brand,
    displayInfo: [info.upc]
  }
}

export const convertAuditProductInfoList = (list) => (list || []).map(convertAuditProductInfo)