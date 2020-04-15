import httpClient from '../client/instance/product'
import defaultTo from 'lodash/defaultTo'
import {
  Pagination
} from '../interface/common'
import {
  MedicineDetailProduct
} from '../interface/product'
import {
  BATCH_MATCH_TYPE
} from '../enums/batch'
import {
  PRODUCT_STATUS
} from '../enums/product'
import {
  convertProductInfoWithPagination as convertProductInfoWithPaginationFromServer
} from '../helper/product/base/convertFromServer'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertCategoryAttrList,
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer'
import {
  convertProductDetail as convertMedicineDetailFormServer,
  convertMedicineSpUpdateInfo
} from '../helper/product/medicine/convertFromServer'
import {
  convertProductDetail as convertProductDetailWithCategoryAttrToServer
} from '../helper/product/medicine/convertToServer'

/**
 * 药品相关api
 */
// TODO
export const getMedicineInfoList = ({
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
}: {
  poiId: number,
  tagId: number,
  pagination: Pagination,
  status?: PRODUCT_STATUS,
  keyword?: string,
  sorter?: object,
  statusList?: object[],
  brandId?: number,
  needTag?: boolean,
  labelIdList?: number[],
  saleStatus?: boolean,
  limitSale?: boolean,
  stockoutAutoClearStock?: boolean // 缺货自动清除库存
}) => httpClient.post('shangou/medicine/r/searchByCond', {
  wmPoiId: poiId,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  needTag: needTag ? 1 : 0,
  name: '',
  brandId: brandId || 0,
  tagId,
  searchWord: keyword || '',
  state: defaultTo(status, PRODUCT_STATUS.ALL),
  sort: sorter,
  labelIds: labelIdList && labelIdList.join(','),
  saleStatus: saleStatus ? 1 : 0,
  limitSale: limitSale ? 1 : 0,
  noStockAutoClear: stockoutAutoClearStock ? 1 : -1
}).then(data => {
  statusList = statusList || []
  const product = convertProductInfoWithPaginationFromServer(data, {
    pagination,
    statusList
  })
  if (needTag) {
    const tagList = convertTagWithSortListFromServer(data.tagList)
    return {
      ...product,
      productTotal: data.totalCount,
      tagList
    }
  }
  return product
})

/**
 * 下载药品信息
 */
export const downloadMedicineList = ({ poiId }: { poiId: number }) => httpClient.post('shangou/medicine/r/downloadProductByExcel', {
  wmPoiId: poiId,
  v2: 1
})
/**
 * excel 批量创建
 * @param params
 */
export const submitBatchCreateByExcel = (params: {
  poiIdList: number[], // 门店列表
  multiPoiFlag: boolean, // 是否是多品类
  file: File, // excel文件
}) => {
  const { poiIdList, file, multiPoiFlag } = params
  const query = {
    multiPoiFlag,
    wm_poi_ids: poiIdList.join(','),
    wmPoiIds: poiIdList.join(','),
    updfile: file,
    wmPoiId: undefined,
    excelType: 3
  }
  return httpClient.upload('shangou/medicine/batch/w/saveByExcel', query)
}
/**
 * excel 批量修改
 * @param params
 */
export const submitBatchModifyByExcel = (params: {
  poiIdList: number[],
  multiPoiFlag: boolean, // 多品类标志
  excelType: BATCH_MATCH_TYPE, // excel的类型
  file: File // excel文件
}) => {
  const { poiIdList, multiPoiFlag, excelType, file } = params
  return httpClient.upload('shangou/medicine/batch/w/updateByExcel', {
    multiPoiFlag,
    excelType,
    wmPoiIds: poiIdList.join(','),
    updfile: file
  })
}
/**
 * 获取搜索关键字
 * @param poiId 门店id
 * @param keyword 关键字
 */
export const getSearchSuggestion = ({ poiId, keyword }) => httpClient.get('shangou/medicine/r/searchSug', {
  keyword,
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})

/**
 * 根据类目id获取类目属性
 * @param poiId 门店id
 * @param categoryId 类目id
 */
export const getCategoryAttrs = ({ poiId, categoryId }) => httpClient.get('retail/r/getCategoryAttrAndValueList', {
  categoryId,
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return convertCategoryAttrList(data.attrAndValueList, { isMedicine: true })
})

/**
 * 获取药品标品更新信息
 */
export const getSpUpdateInfo = ({ spuId, poiId }: { spuId: number, poiId: number }) => httpClient.post('shangou/medicine/r/detailChangeProduct', { spuId, wmPoiId: poiId }).then(convertMedicineSpUpdateInfo)

/**
 * 获取药品信息
 * @returns {药品详情}
 */
export const getProductInfo = async ({ spuId, poiId }: { spuId: number, poiId: number }) => {
  const product = await httpClient.post('shangou/medicine/r/detailProduct', { spuId, wmPoiId: poiId })
  const categoryId = product.categoryId || 0
  let categoryAttrList = []
  try {
    categoryAttrList = await getCategoryAttrs({ poiId, categoryId })
  } catch (err) {
    console.error(err)
  }
  product.categoryAttrList = categoryAttrList
  return convertMedicineDetailFormServer(product)
}

/**
 * 获取药品信息
 * @returns {所有店内分类}
 */
export const saveProductInfo = async ({ product, poiId }: { product: MedicineDetailProduct, poiId: number }) => {
  const newProduct = convertProductDetailWithCategoryAttrToServer(product)
  const params: any = {
    ...newProduct,
    wmPoiId: poiId
  }
  return httpClient.post('shangou/medicine/w/save', {
    saveProductSkuJson: JSON.stringify(params)
  })
}
