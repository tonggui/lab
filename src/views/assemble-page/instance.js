import Domain from '@/views/assemble-page/domain'
import api from './service'
import services from './methods'

const DomainInstance = new Domain({
  data: {
    product: {},
    originalFormData: {},
    poiNeedAudit: false,
    supportAudit: true,
    categoryNeedAudit: false,
    originalProductCategoryNeedAudit: false
  },
  api,
  services
})

export const methods = DomainInstance.services

export const data = DomainInstance.data
