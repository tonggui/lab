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
import {
  fetchTaskList
} from '../api/task'
import {
  convertTaskList as convertTaskListFromServer
} from '../helper/common/convertFromServer'

import { wrapAkitaBusiness } from '@/common/akita'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'

/* Akita wrapper start */
const akitaWrappedSubmitDeleteProduct = wrapAkitaBusiness(MODULE.SINGLE_POI_PRODUCT, TYPE.DELETE, true)(submitDeleteProduct)
const akitaWrappedSubmitModProductSellStatus = wrapAkitaBusiness(
  (sellstatus) => {
    const type = sellstatus ? TYPE.OFF_SHELF : TYPE.ON_SHELF
    return [MODULE.SINGLE_POI_PRODUCT, type, true]
  }
)(submitModProductSellStatus)
const akitaWrappedSubmitModProductSkuPrice = wrapAkitaBusiness(MODULE.SINGLE_POI_PRODUCT, TYPE.UPDATE_PRICE, true)(submitModProductSkuPrice)
const akitaWrappedSubmitModProductSkuStock = wrapAkitaBusiness(MODULE.SINGLE_POI_PRODUCT, TYPE.UPDATE_STOCK, true)(submitModProductSkuStock)
const akitaWrappedSubmitModProductName = wrapAkitaBusiness(MODULE.SINGLE_POI_PRODUCT, TYPE.UPDATE_TITLE, true)(submitModProductName)
/* Akita wrapper end */

export const fetchGetDownloadTaskList = async (poiId: number) => {
  const type = isMedicine() ? 3 : 6
  const { list } = await fetchTaskList({
    pagination: ({ pageSize: 10, current: 1 }) as Pagination,
    type,
    wmPoiId: poiId
  })
  return convertTaskListFromServer(list)
}

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
export const fetchGetProductInfoList = ({
    needTag, brandId, keyword, status, tagId, sorter, labelIdList, saleStatus
  }: {
    needTag: boolean,
    keyword: string,
    brandId: number,
    status: PRODUCT_STATUS,
    tagId: number,
    sorter: object,
    labelIdList: number[],
    saleStatus: boolean
  },
  pagination: Pagination,
  statusList,
  poiId
) => {
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
    needTag,
    labelIdList,
    saleStatus
  })
}
// 获取搜索状态的商品
// TODO 希望推动后端和fetchGetProductInfoList接口合一
export const fetchGetProductListOnSorting = (tagId: number, pagination: Pagination, poiId: number) => {
  let api = getProductListOnSorting
  if (isMedicine()) {
    api = getMedicineInfoList
  }
  return api({
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
    return akitaWrappedSubmitModProductSkuPrice(params.price.value, { skuId, poiId })
  }
  if ('stock' in params) {
    return akitaWrappedSubmitModProductSkuStock(params.stock, { skuIdList: [skuId], poiId })
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
    return akitaWrappedSubmitDeleteProduct(query)
  }
  let handler: any = noop;
  switch(type) {
    case PRODUCT_BATCH_OP.PUT_OFF:
      handler = wrapAkitaBusiness(MODULE.SINGLE_POI_PRODUCT, TYPE.OFF_SHELF, true)(submitModProductSellStatus)
    break
    case PRODUCT_BATCH_OP.PUT_ON:
      handler = wrapAkitaBusiness(MODULE.SINGLE_POI_PRODUCT, TYPE.ON_SHELF, true)(submitModProductSellStatus)
    break
    case PRODUCT_BATCH_OP.MOD_STOCK:
      handler = akitaWrappedSubmitModProductSkuStock
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

export const fetchGetProductDetailAndCategoryAttr = (id: number, poiId: number, categoryAttrSwitch: boolean) =>
  categoryAttrSwitch ? fetchGetProductDetailWithCategoryAttr(id, poiId) : fetchGetProductDetail(id, poiId)

export const fetchSubmitEditProduct = wrapAkitaBusiness(
  (product) => {
    const type = product.id ? TYPE.UPDATE : TYPE.CREATE
    return [MODULE.SINGLE_POI_PRODUCT, type, true]
  }
)(
  (product: Product, context, poiId: number) => {
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
)

export const fetchSubmitDeleteProduct = (product: ProductInfo, isCurrentTag: boolean, { tagId, productStatus, poiId } : { tagId: number, productStatus: PRODUCT_STATUS, poiId: number }) => {
  if (isCurrentTag) {
    return submitDeleteProductTagById({
      spuId: product.id,
      tagId,
      poiId
    })
  }
  return akitaWrappedSubmitDeleteProduct({
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
    return akitaWrappedSubmitModProductSellStatus(params.sellStatus, {
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
    return akitaWrappedSubmitModProductName({ spuId, name: params.name, poiId  })
  }
}

export const fetchSubmitUpdateProductSequence = (spuId, sequence, { tagId, poiId }) => submitUpdateProductSequence({
  spuId,
  sequence,
  poiId,
  tagId
})

export const fetchSubmitToggleProductToTop = (spuId, sequence, isSmartSort, { tagId, poiId }) => submitToggleProductToTop({
  isSmartSort,
  tagId,
  spuId,
  sequence,
  poiId
})

export const fetchSubmitApplyProductInfo = ({ wmPoiId, pictureList, name, value }) => submitApplyProductInfo({
  wmPoiId, pictureList, name, value
})

export const fetchSubmitChangeProductSortType = (isSmartSort: boolean, topCount: number, tagId: number, poiId: number) => submitChangeProductSortType({
  tagId,
  poiId,
  topCount,
  isSmartSort
})
