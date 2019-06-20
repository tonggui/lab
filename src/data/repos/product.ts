import noop from 'lodash/noop'
import { isMedicine } from '@/common/app'
import {
  Pagination
} from '../interface/common'
import {
  Product
} from '../interface/product'
import {
  PRODUCT_STATUS
} from '../enums/product'
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
  submitApplyProductInfo
} from '../api/product'
import {
  downloadMedicineList,
  getMedicineInfoList,
  getSearchSuggestion as medicineGetSearchSuggestion
} from '../api/medicine'

export const fetchDownloadProduct = (poiId) => {
  // 是否药品判断
  let api = downloadProductList
  if (isMedicine()) {
    api = downloadMedicineList 
  }
  return api({ poiId })
}

export const fetchGetSearchSuggestion = (keyword: string, poiId: number) => {
  // 是否药品判断
  let api = getSearchSuggestion
  if (isMedicine()) {
    api = medicineGetSearchSuggestion 
  }
  return api({ poiId, keyword })
}

export const fetchGetProductInfoList = ({ keyword, status, tagId, sorter }: { keyword: string, status: PRODUCT_STATUS, tagId: number, sorter }, pagination: Pagination, statusList, poiId) => {
  let api = getProductInfoList
  if (isMedicine()) {
    api = getMedicineInfoList
  }
  const sort = {};
  if (sorter) {
    Object.keys(sorter).forEach(
      (field) => {
        sort[field] = String(sorter[field]).replace('end', '')
      },
    );
  }
  return api({
    poiId,
    tagId,
    keyword,
    status,
    pagination,
    sorter: sort,
    statusList
  })
}

export const fetchGetProductListOnSorting = ({ keyword, status, tagId }: { keyword: string, status: PRODUCT_STATUS, tagId: number }, pagination: Pagination, statusList, poiId) => {
  return getProductListOnSorting({
    poiId,
    tagId,
    keyword,
    status,
    pagination,
    statusList
  })
}

/**
 * sku纬度的修改
 * @param skuId sku id
 * @param params 
 */
export const fetchSubmitModProductSku = (skuId, params, poiId) => {
  if (params.type === 'price') {
    return submitModProductSkuPrice(params.value, { skuId, poiId })
  }
  if (params.type === 'stock') {
    return submitModProductSkuStock(params.value, { skuId, poiId })
  }
}

// TODO
/**
 * 修改商品
 * @param param0 
 * @param params 
 */
export const fetchSubmitModProduct = ({
  tagId, spuIdList, skuIdList, productStatus, poiId,
}, params) => {
  const query = {
    poiId,
    tagCat: tagId,
    spuIds: spuIdList.join(','),
    skuIds: skuIdList.join(','),
    opTab: productStatus,
  }
  let handler: any = noop;
  switch(params.type) {
    case 'sellStatus':
      handler = submitModProductSellStatus
    break
    case 'stock':
      handler = submitModProductSkuStock
    break
    case 'sellTime':
      handler = submitModProductSellTime
    break
    case 'tag':
      handler = submitModProductTag
    break
    case 'label':
      handler = submitModProductLabel
    break
  }
  return handler(params.value, query)
}

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

export const fetchGetProductLabelList = (poiId: number) => getProductLabelList({ poiId })

export const fetchGetProductSortInfo = (tagId, poiId) => getProductSortInfo({ poiId, tagId })

export const fetchSubmitDeleteProduct = (skuIdList: number[], tagId: number, productStatus: PRODUCT_STATUS, poiId: number) => submitDeleteProduct({
  tagId,
  skuIdList,
  productStatus,
  poiId
})

export const fetchSubmitDeleteProductTagById = (spuId: number, tagId: number, poiId: number) => submitDeleteProductTagById({ spuId, tagId, poiId })

export const fetchSubmitModProductPicture = (spuId, pictureList, poiId) => submitModProductPicture({ spuId, pictureList, poiId })

export const fetchSubmitModProductName = (spuId, name, poiId) => submitModProductName({
  spuId,
  name,
  poiId
})

export const fetchSubmitUpdateProductSequence = (spuId, tagId, sequence, poiId) => submitUpdateProductSequence({
  spuId,
  sequence,
  poiId,
  tagId
})

export const fetchSubmitToggleProductToTop = (spuId, tagId, type, sequence) => submitToggleProductToTop({ type, tagId, spuId, sequence })

export const fetchSubmitApplyProductInfo = ({ pictureList, name, value }) => submitApplyProductInfo({
  pictureList, name, value
})
