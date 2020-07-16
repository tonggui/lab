import {
  getPoiPackageProductAgreementInfo,
  submitPoiPackageProductAgreement,
  fetchGetPackageProductModuleSwitch as packageProductModuleSwitch
} from '@/data/api/productPackage'

export const fetchGetPackageProductAgreement = (poiId: number) => getPoiPackageProductAgreementInfo({ poiId })
export const fetchSubmitPackageProductAgreement = (poiId: number) => submitPoiPackageProductAgreement({ poiId })
export const fetchGetPackageProductModuleSwitch = (poiId: number) => packageProductModuleSwitch({ poiId })

export {
  fetchGetPackageProductDetail,
  submitPackageProduct
} from '@/data/api/productPackage'
