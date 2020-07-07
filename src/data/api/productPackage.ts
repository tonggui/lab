import httpClient from '../client/instance/packageProduct'
import { PackageProductInfo } from '@/data/interface/product'
import { convertPackageProductDetail } from '@/data/helper/product/packageProduct/convertFromServer'
import { convertPackageProductToServer } from '@/data/helper/product/packageProduct/convertToServer'

export const fetchGetPackageProductDetail = ({ poiId, id }: { poiId: number, id: number }): Promise<PackageProductInfo> => httpClient
  .post('shangou/package/r/detailProduct', { wmPoiId: poiId, spuId: id }).then(convertPackageProductDetail)

export const submitPackageProduct = ({ poiId, data }: { poiId: number, data: PackageProductInfo }) => httpClient
  .post('shangou/package/w/save', { wmPoiId: poiId, ...convertPackageProductToServer(data) })

export const fetchGetPackageProductModuleSwitch = ({ poiId }: { poiId: number }): Promise<boolean> => httpClient
  .post('shangou/package/r/getSwitch', { wmPoiId: poiId })

/**
 * 获取门店组包商品的签署协议信息
 * @param poiId
 * @return {*}
 */
export const getPoiPackageProductAgreementInfo = ({ poiId }: { poiId: number }) => httpClient
  .post('shangou/package/r/getComposeProductAgreement', {
    wmPoiId: poiId
  }).then(data => {
    const {
      agreementUrl,
      signed,
      supermarketChain,
      signRequired = true,
      ...others
    } = data
    return {
      ...others,
      url: agreementUrl,
      signed,
      isMultiple: supermarketChain,
      required: signRequired
    }
  })

/**
 * 提交门店组包商品签署协议确认
 * @param poiId
 * @return {*}
 */
export const submitPoiPackageProductAgreement = ({ poiId }: { poiId: number }) => httpClient
  .post('shangou/package/w/submitComposeAgreement', {
    wmPoiId: poiId
  })
