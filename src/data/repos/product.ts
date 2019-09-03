import noop from 'lodash/noop'
import { isMedicine } from '@/common/app'
import {
  Pagination
} from '../interface/common'
import {
  Product, ProductInfo
} from '../interface/product'
import {
  PRODUCT_STATUS,
  PRODUCT_BATCH_OP
} from '../enums/product'
import {
  defaultProductStatus
} from '../constants/product'
import {
  submitModProductSkuPrice,
  submitModProductSkuStock,
  submitModProductSellStatus,
  submitModProductSellTime,
  submitModProductTag,
  submitModProductLabel,
  downloadProductList,
  getSearchSuggestion,
  getProductInfoList,
  getProductListOnSorting,
  getProductDetail,
  getProductDetailWithCategoryAttr,
  submitEditProduct,
  submitEditProductWithCategoryAttr,
  getProductLabelList,
  getProductSortInfo,
  submitDeleteProduct,
  submitDeleteProductTagById,
  submitModProductPicture,
  submitModProductName,
  submitUpdateProductSequence,
  submitToggleProductToTop,
  submitApplyProductInfo,
  submitChangeProductSortType
} from '../api/product'
import {
  downloadMedicineList,
  getMedicineInfoList,
  getSearchSuggestion as medicineGetSearchSuggestion
} from '../api/medicine'

// 下载商品 区分药品
export const fetchDownloadProduct = (poiId: number) => {
  // 是否药品判断
  let api = downloadProductList
  if (isMedicine()) {
    api = downloadMedicineList 
  }
  return api({ poiId })
}
// 搜索商品sug
export const fetchGetSearchSuggestion = (keyword: string, poiId: number) => {
  // 是否药品判断
  let api = getSearchSuggestion
  if (isMedicine()) {
    api = medicineGetSearchSuggestion 
  }
  return api({ poiId, keyword })
}
// 列表页 商品列表
export const fetchGetProductInfoList = ({ needTag, brandId, keyword, status, tagId, sorter }: { needTag: boolean, keyword: string, brandId: number, status: PRODUCT_STATUS, tagId: number, sorter }, pagination: Pagination, statusList, poiId) => {
  let api = getProductInfoList
  if (isMedicine()) {
    api = getMedicineInfoList
  }
  return api({
    poiId,
    tagId,
    keyword,
    status,
    pagination,
    sorter,
    statusList,
    brandId,
    needTag
  })
}
// 获取搜索状态的商品
// TODO 希望推动后端和fetchGetProductInfoList接口合一
export const fetchGetProductListOnSorting = (tagId: number, pagination: Pagination, poiId: number) => {
  return getProductListOnSorting({
    poiId,
    tagId,
    keyword: '',
    status: defaultProductStatus,
    pagination: pagination,
    statusList: []
  })
}

/**
 * sku纬度的修改
 * @param skuId sku id
 * @param params 
 */
export const fetchSubmitModProductSku = (skuId, params, poiId) => {
  if ('price' in params) {
    return submitModProductSkuPrice(params.price, { skuId, poiId })
  }
  if ('stock' in params) {
    return submitModProductSkuStock(params.stock, { skuIdList: [skuId], poiId })
  }
}
// 列表页 批量操作商品
/**
 * 
 * @param type 批量操作类型
 * @param params 批量操作的参数
 * @param productList 批量操作的商品列表
 * @param param3 全局的一些参数，包括分类id，商品状态，门店id
 */
export const fetchSubmitBatchOperationProduct = (type, params, productList: ProductInfo[], {
  tagId, productStatus, poiId
}) => {
  const spuIdList: number[] = []
  const skuIdList: number[] = []
  productList.forEach(product => {
    spuIdList.push(product.id)
    product.skuList.forEach(sku => skuIdList.push(sku.id as number))
  })
  const query = {
    poiId,
    tagId,
    spuIdList,
    skuIdList,
    productStatus,
  }
  // 批量删除
  if (type === PRODUCT_BATCH_OP.DELETE) {
    return submitDeleteProduct(query)
  }
  let handler: any = noop;
  switch(type) {
    case PRODUCT_BATCH_OP.PUT_OFF:
    case PRODUCT_BATCH_OP.PUT_ON:
      handler = submitModProductSellStatus
    break
    case PRODUCT_BATCH_OP.MOD_STOCK:
      handler = submitModProductSkuStock
    break
    case PRODUCT_BATCH_OP.MOD_TIME:
      handler = submitModProductSellTime
    break
    case PRODUCT_BATCH_OP.MOD_TAG:
      handler = submitModProductTag
    break
    case PRODUCT_BATCH_OP.MOD_LABEL:
      handler = submitModProductLabel
    break
  }
  return handler(params, query)
}

export const fetchGetProductLabelList = (poiId: number) => getProductLabelList({ poiId })

export const fetchGetProductSortInfo = (tagId, poiId) => getProductSortInfo({ poiId, tagId })

export const fetchGetProductDetail = (id: number, poiId: number) => getProductDetail({ id, poiId })

export const fetchGetProductDetailWithCategoryAttr = (id: number, poiId: number) => getProductDetailWithCategoryAttr({ id, poiId })

export const fetchSubmitEditProduct = (product: Product, context, poiId: number) => {
  const { categoryAttrSwitch } = context
  let api = submitEditProduct
  if (categoryAttrSwitch) {
    api = submitEditProductWithCategoryAttr
  }
  return api({
    poiId,
    product,
    context
  })
}

export const fetchSubmitDeleteProduct = (product: ProductInfo, isCurrentTag: boolean, { tagId, productStatus, poiId } : { tagId: number, productStatus: PRODUCT_STATUS, poiId: number }) => {
  if (isCurrentTag) {
    return submitDeleteProductTagById({
      spuId: product.id,
      tagId,
      poiId
    })
  }
  return submitDeleteProduct({
    tagId,
    skuIdList: product.skuList.map(sku => sku.id as number),
    productStatus,
    poiId
  })
}

export const fetchSubmitModProduct = (product: ProductInfo, params, { tagId, productStatus, poiId }) => {
  const spuId = product.id
  const skuList = product.skuList
  if ('sellStatus' in params) {
    return submitModProductSellStatus(params.sellStatus, {
      poiId,
      tagId,
      spuIdList: [spuId],
      skuIdList: skuList.map(sku => sku.id),
      productStatus
    })
  }
  if ('pictureList' in params) {
    return submitModProductPicture({ spuId, pictureList: params.pictureList, poiId })
  }
  if ('name' in params) {
    return submitModProductName({ spuId, name: params.name, poiId  })
  }
}

export const fetchSubmitUpdateProductSequence = (spuId, sequence, { tagId, poiId }) => submitUpdateProductSequence({
  spuId,
  sequence,
  poiId,
  tagId
})

export const fetchSubmitToggleProductToTop = (spuId, isSmartSort, sequence, { tagId }) => submitToggleProductToTop({
  isSmartSort,
  tagId,
  spuId,
  sequence
})

export const fetchSubmitApplyProductInfo = ({ pictureList, name, value }) => submitApplyProductInfo({
  pictureList, name, value
})

export const fetchSubmitChangeProductSortType = (isSmartSort: boolean, topCount: number, tagId: number, poiId: number) => submitChangeProductSortType({
  tagId,
  poiId,
  topCount,
  isSmartSort
})
