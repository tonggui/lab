import {
  getPoiPackageProductAgreementInfo,
  submitPoiPackageProductAgreement
} from '@/data/api/productPackage'

export const fetchGetPackageProductAgreement = (poiId: number) => getPoiPackageProductAgreementInfo({ poiId })
export const fetchSubmitPackageProductAgreement = (poiId: number) => submitPoiPackageProductAgreement({ poiId })

export {
  fetchGetPackageProductDetail,
  submitPackageProduct,
  fetchGetPackageProductModuleSwitch
} from '@/data/api/productPackage'
