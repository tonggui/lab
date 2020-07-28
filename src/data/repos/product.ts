import noop from 'lodash/noop'
import { isMedicine } from '@/common/app'
import {
  Pagination
} from '../interface/common'
import {
  Product, ProductInfo, ApiAnomalyType, CellularProduct, RecommendProduct
} from '../interface/product'
import {
  PRODUCT_STATUS,
  PRODUCT_BATCH_OP,
  PRODUCT_AUDIT_STATUS
} from '../enums/product'
import {
  TOP_STATUS,
  EDIT_TYPE
} from '../enums/common'

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
  getProductDetailWithCategoryAttr,
  getNeedAudit,
  submitEditProductWithCategoryAttr,
  submitRevocation,
  getProductLabelList,
  getProductSortInfo,
  getCategoryAppealInfo,
  submitDeleteProduct,
  submitDeleteProductTagById,
  submitModProductPicture,
  submitModProductName,
  submitUpdateProductSequence,
  submitToggleProductToTop,
  submitApplyProductInfo,
  submitChangeProductSortType,
  getAuditProductList,
  getAuditProductDetail,
  submitCancelProductAudit,
  getAnomalyList,
  submitSetSellStatus,
  submitCheckPrice,
  submitUpdateTag,
  submitApplyProduct,
  submitModProductStockoutAutoClearStock,
  getCellularProductStatistics,
  getCellularProductList,
  getCellularNewProductIsMatchTag,
  submitCellularProductPuton,
  getFalsePriceList,
  submitFlasePriceToSuggestedPrice,
  getInfoViolationList,
  getInfoVioProductDetail,
  getRecommendProductList,
  getRecommendSearchSuggestion,
  getCheckProducts,
  getUploadRecTips,
  submitBatchCreateRecommendProduct,
  submitSingleCreateRecommendProduct
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
const akitaWrappedSubmitApplyProduct = wrapAkitaBusiness(MODULE.COMMON, TYPE.PRODUCT_APPLY, true)(submitApplyProduct)
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
  return api({
    poiId,
    keyword,
    auditStatus: [
      PRODUCT_AUDIT_STATUS.UNAUDIT,
      PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
      PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
    ]
  })
}
export const fetchGetAuditProductSearchSuggestion = (keyword: string, poiId: number) => {
  // TODO 药品门店
  return getSearchSuggestion({
    poiId,
    keyword,
    auditStatus: [
      PRODUCT_AUDIT_STATUS.AUDITING,
      PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
      PRODUCT_AUDIT_STATUS.AUDIT_APPROVED
    ]
  })
}
// 列表页 商品列表
export const fetchGetProductInfoList = ({
    tagId,
    status,
    needTag,
    brandId,
    keyword,
    sorter,
    labelIdList,
    saleStatus,
    limitSale,
    stockoutAutoClearStock
  }: {
    tagId: number,
    status?: PRODUCT_STATUS,
    needTag?: boolean,
    keyword?: string,
    brandId?: number,
    sorter?: object,
    labelIdList?: number[],
    saleStatus?: boolean,
    limitSale?: boolean,
    stockoutAutoClearStock?: boolean
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
    saleStatus,
    limitSale,
    stockoutAutoClearStock
  })
}
// 获取搜索状态的商品
// TODO 希望推动后端和fetchGetProductInfoList接口合一
export const fetchGetProductListOnSorting = ({ tagId } :{ tagId: number }, pagination: Pagination, poiId: number) => {
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
// 获取商品是否满足需要送审条件
export const fetchGetNeedAudit = (categoryId, poiId) => getNeedAudit({ categoryId, poiId })

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

export const fetchGetProductDetail = (id: number, poiId: number, audit?: boolean) => {
  return audit ? getAuditProductDetail({ id, poiId }) : getProductDetailWithCategoryAttr({ id, poiId })
}

export const fetchGetAuditProductDetail = (id: number, poiId: number) => getAuditProductDetail({ id, poiId })

export const fetchGetCategoryAppealInfo = (id: number, poiId: number) => getCategoryAppealInfo({ id, poiId })

export const fetchSubmitEditProduct = wrapAkitaBusiness(
  (product) => {
    const type = product.id ? TYPE.UPDATE : TYPE.CREATE
    return [MODULE.SINGLE_POI_PRODUCT, type, true]
  }
)(
  (product: Product, context, poiId: number) => {
    // 审核中且编辑类型不为审核中修改时
    if (product.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING && context.editType !== EDIT_TYPE.AUDITING_MODIFY_AUDIT) {
      return submitRevocation({ id: product.id, poiId })
    }
    return submitEditProductWithCategoryAttr({
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
  if ('stockoutAutoClearStock' in params) {
    const productStockConfig = {
      status: 2 // 1表示开启配置 2 表示清空配置
    }
    return submitModProductStockoutAutoClearStock({ spuId, productStockConfig, poiId })
  }
}

export const fetchSubmitUpdateProductSequence = (spuId, sequence, { tagId, poiId }) => submitUpdateProductSequence({
  spuId,
  sequence,
  poiId,
  tagId
})

export const fetchSubmitToggleProductToTop = (spuId, sequence, type: TOP_STATUS, { tagId, poiId }) => submitToggleProductToTop({
  type,
  tagId,
  spuId,
  sequence,
  poiId
})

export const fetchSubmitApplyProductInfo = ({ wmPoiId, pictureList, name, value }) => submitApplyProductInfo({
  wmPoiId, pictureList, name, value
})

export const fetchSubmitApplyProduct = (name, pictureList) => akitaWrappedSubmitApplyProduct({
  pictureList, name
})

export const fetchSubmitChangeProductSortType = (isSmartSort: boolean, topCount: number, tagId: number, poiId: number) => submitChangeProductSortType({
  tagId,
  poiId,
  topCount,
  isSmartSort
})

export const fetchGetAuditProductList = (filter: {
  auditStatus: PRODUCT_AUDIT_STATUS[],
  searchWord: string
}, pagination: Pagination, poiId: number) => getAuditProductList({
  pagination,
  poiId,
  ...filter
})

export const fetchSubmitCancelProductAudit = (spuId: number, poiId: number) => submitCancelProductAudit({ spuId, poiId }) 
export const fetchGetAnomalyList = (poiId: number, type: ApiAnomalyType, pagination: Pagination) => getAnomalyList({
  poiId,
  type,
  pagination
})

export const fetchSubmitSetSellStatus = (poiId: number, spuId) => submitSetSellStatus({
  poiId,
  spuId
})

export const fetchSubmitCheckPrice = skuId => submitCheckPrice(skuId)

export const fetchSubmitUpdateTag = spu => submitUpdateTag(spu)

export const fetchGetCellularProductStatistics = (spuId: number, { awardCode, awardTypeCode }: { awardCode: string, awardTypeCode: string }, poiId: number) => getCellularProductStatistics({
  poiId,
  spuId,
  awardCode,
  awardTypeCode
})

export const fetchGetCellularExistProductList = ({ keyword } : { keyword: string }, pagination: Pagination, spuId: number, { awardCode, awardTypeCode }: { awardCode: string, awardTypeCode: string }, poiId: number) => getCellularProductList({
  poiId,
  spuId,
  keyword,
  awardCode,
  awardTypeCode,
  pagination,
  status: 1 // 1-已有商品，2-新商品
})

export const fetchGetCellularNewProductList = ({ keyword } : { keyword: string }, pagination: Pagination, spuId: number, { awardCode, awardTypeCode }: { awardCode: string, awardTypeCode: string }, poiId: number) => getCellularProductList({
  poiId,
  spuId,
  keyword,
  pagination,
  awardCode,
  awardTypeCode,
  status: 2 // 1-已有商品，2-新商品
})

export const fetchGetCellularNewProductIsMatchTag = (spuId: number, { awardCode, awardTypeCode }: { awardCode: string, awardTypeCode: string }, poiId: number) => getCellularNewProductIsMatchTag({ spuId, poiId, awardCode, awardTypeCode })

export const fetchSubmitCellularProductPuton = (product: CellularProduct, poiId: number) => submitCellularProductPuton({ product, poiId })
export const fetchGetFalsePriceList = (specSkuIds: number, pagination: Pagination, poiId: number) => getFalsePriceList({
  poiId,
  specSkuIds,
  pagination
}).then((data) => {
  const {
    violationTotalCount,
    falsePriceTotalCount,
    update_time: updateTime,
    isfalsePriceModifyAllowed,
    falsePriceModifyAllowedTimeRange,
    falsePriceModifyHint,
    productFalsePrices
  } = data
  const {
    not_correct_count: notCorrectCount = 0,
    correct_count: correctCount = 0,
    false_price_list: falsePriceList = []
  } = productFalsePrices
  const page = pagination
  pagination.total = falsePriceTotalCount
  return {
    violationTotalCount,
    falsePriceTotalCount,
    updateTime,
    isfalsePriceModifyAllowed,
    falsePriceModifyAllowedTimeRange,
    falsePriceModifyHint,
    notCorrectCount,
    correctCount,
    falsePriceList,
    pagination: page
  }
})

export const fetchSubmitFlasePriceToSuggestedPrice = (skuId: number, poiId: number) => submitFlasePriceToSuggestedPrice({
  skuId,
  poiId
})

export const fetchGetInfoViolationList = (pagination: Pagination, poiId: number) => getInfoViolationList({
  poiId,
  pagination
})

export const fetchGetInfoVioProductDetail = (violationProcessingId: number) => getInfoVioProductDetail({
  violationProcessingId
})

// 获取推荐商品列表
export const fetchGetRecommendProductList = (pagination: Pagination, { keyword, isProductVisible, tagId } : { keyword: string, isProductVisible: boolean, tagId: number }, poiId: number) => getRecommendProductList({
  poiId, keyword, isProductVisible, pagination, tagId
})

// 搜索推荐商品sug
export const fetchRecommendSearchSuggestion = (keyword: string, poiId: number) => getRecommendSearchSuggestion({ poiId, keyword })

// 创建商品前校验
export const fetchCheckProducts = (productList: RecommendProduct[], poiId: number) => getCheckProducts({ productList, poiId })

// 门店新建商品录入引导文档
export const fetchUploadRecTips = (poiId: number) => getUploadRecTips({ poiId })

export const fetchSubmitBatchCreateRecommendProduct = (productList: RecommendProduct[], poiId: number) => submitBatchCreateRecommendProduct({
  productList,
  poiId
})

export const fetchSubmitSingleCreateRecommendProduct = (product: RecommendProduct, poiId) => submitSingleCreateRecommendProduct({
  product,
  poiId
})
