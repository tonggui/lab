import {
  Pagination
} from '../interface/common'

import {
  getProductList,
  submitUpdateProductSequence,
  submitAsyncProductSequence,
  submitModProductSellStatus,
  submitDeleteProduct,
  submitModProductSkuPrice,
  submitModProductSkuStock
} from '../medicineMerchantApi/product'


import {
  MERCHANT_PRODUCT_STATUS,
  PRODUCT_SELL_STATUS,
  SKU_EDIT_TYPE
} from '../enums/product'

import {
  MerchantProduct,
  Sku
} from '../interface/product'

import { wrapAkitaBusiness } from '@/common/akita/index'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'

/* Akita wrapper start */
const akitaWrappedSubmitModProductSellStatus = wrapAkitaBusiness(
  (params) => {
    const type = params.sellStatus ? TYPE.OFF_SHELF : TYPE.ON_SHELF
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(submitModProductSellStatus)
/* Akita wrapper end */

export const fetchGetProductList = ({ tagId, status } : { tagId: number, status: MERCHANT_PRODUCT_STATUS }, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, needTags: 2, status })
}

export const fetchSubmitUpdateProductSequence = (spuId: number, sequence: number, { tagId }: { tagId: number }) => submitUpdateProductSequence({
  spuId,
  sequence,
  tagId
})

export const fetchSubmitAsyncProductSequence = (tagId: number, { isSelectAll, poiIdList }) => submitAsyncProductSequence({
  tagId,
  isSelectAll,
  poiIdList
})

export const fetchSubmitModProductSellStatus = (idList: number[], sellStatus: PRODUCT_SELL_STATUS) => akitaWrappedSubmitModProductSellStatus({ idList, sellStatus })

export const fetchSubmitModProduct = (product: MerchantProduct, params) => {
  const spuId = product.id
  if ('sellStatus' in params) {
    // 单条修改
    return fetchSubmitModProductSellStatus([spuId], params.sellStatus)
  }
  // TODO 其他修改逻辑
}

export const fetchSubmitDeleteProduct = wrapAkitaBusiness(MODULE.MERCHANT_PRODUCT, TYPE.DELETE, true)(
  (idList: number[], isMerchantDelete: boolean, isSelectAll: boolean, poiIdList: number[]) => submitDeleteProduct({ idList, isMerchantDelete, isSelectAll, poiIdList })
)

export const fetchSubmitModProductSku = (type: SKU_EDIT_TYPE, product: MerchantProduct, skuList: Sku[], { poiIdList, isSelectAll } : { poiIdList: number[], isSelectAll: boolean }) => {
  if (type === SKU_EDIT_TYPE.PRICE) {
    return fetchSubmitModProductSkuPrice(product, skuList, poiIdList, isSelectAll)
  } else if (type === SKU_EDIT_TYPE.STOCK) {
    return fetchSubmitModProductSkuStock(product, skuList, poiIdList, isSelectAll)
  }
}

export const fetchSubmitModProductSkuPrice = (product: MerchantProduct, skuList: Sku[], poiIdList: number[], isSelectAll: boolean) => {
  const skuMap = product.skuList.reduce((prev, sku) => {
    prev[sku.id] = sku.price.value
    return prev
  }, {})
  const formatSkuList = skuList.map(sku => {
    return {
      skuId: sku.id as number,
      price: sku.price.value!,
      isChanged: sku.price.value !== skuMap[sku.id]
    }
  })
  return submitModProductSkuPrice({
    spuId: product.id,
    poiIdList,
    skuIdPriceMap: formatSkuList,
    isSelectAll
  })
}

export const fetchSubmitModProductSkuStock = (product: MerchantProduct, skuList: Sku[], poiIdList: number[], isSelectAll: boolean) => {
  const skuMap = product.skuList.reduce((prev, sku) => {
    prev[sku.id] = sku.stock
    return prev
  }, {})
  const formatSkuList = skuList.map(sku => {
    return {
      skuId: sku.id as number,
      stock: sku.stock,
      isChanged: sku.stock !== skuMap[sku.id]
    }
  })
  return submitModProductSkuStock({ spuId: product.id, poiIdList, skuIdStockMap: formatSkuList, isSelectAll })
}