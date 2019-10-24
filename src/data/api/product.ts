import httpClient from '../client/instance/product'
import {
  Pagination
} from '../interface/common'
import {
  Product
} from '../interface/product'
import {
  TOP_STATUS
} from '../enums/common'
import {
  PRODUCT_STATUS
} from '../enums/product'
import {
  convertProductInfoWithPagination as convertProductInfoWithPaginationFromServer,
  convertProductDetail as convertProductDetailFromServer
} from '../helper/product/base/convertFromServer'
import {
  convertProductDetail as convertProductDetailToServer,
  convertSellTime as convertSellTimeToServer,
  convertProductVideoToServer
} from '../helper/product/base/convertToServer'
import {
  convertProductDetail as convertProductDetailWithCategoryAttrFromServer
} from '../helper/product/withCategoryAttr/convertFromServer'
import {
  convertProductLabelList as convertProductLabelListFromServer
} from '../helper/product/utils'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertProductDetail as convertProductDetailWithCategoryAttrToServer
} from '../helper/product/withCategoryAttr/convertToServer'
import {
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer';

/**
 * 下载门店商品
 * @param poiId 门店id
 */
export const downloadProductList = ({ poiId }: { poiId: number }) => httpClient.post('food/r/downloadProductByExcel', {
  v2: 1,
  wmPoiId: poiId
})
/**
 * 获取搜索关键字
 * @param poiId 门店id
 * @param keyword 关键字
 * 后端接口参数：
 * wm_poi_id: poiId
 * keyword
 */
export const getSearchSuggestion = ({ poiId, keyword }: { poiId: number, keyword: string }) => httpClient.post('retail/r/searchSug', {
  wm_poi_id: poiId,
  keyword
}).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})
/**
 * 获取商品列表
 * @param tagId 店内分类id
 * @param keyword 关键字
 * @param status 商品状态
 * @param pagination 分页信息
 * @param sorter 排序信息
 * @param statusList 商品状态列表
 * 接口参数：
 * wmPoiId: poiId,
 * pageNum: pagination.current,
 * pageSize: pagination.pageSize,
 * needTag: 0,
 * name: '',
 * brandId: 0,
 * tagId,
 * searchWord: keyword,
 * state: status,
 * sort: sorter
 */
export const getProductInfoList = ({
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
}: {
  poiId: number,
  tagId: number,
  keyword: string,
  status: PRODUCT_STATUS,
  sorter,
  statusList,
  pagination: Pagination,
  brandId: number,
  needTag: boolean,
  labelIdList: number[],
  saleStatus: boolean
}) => httpClient.post('retail/r/searchByCond', {
  wmPoiId: poiId,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  needTag: needTag ? 1 : 0,
  name: '',
  brandId: brandId || 0,
  tagId,
  searchWord: keyword || '',
  state: status,
  sort: sorter,
  labelIds: labelIdList && labelIdList.join(','),
  saleStatus: saleStatus ? 1 : 0
}).then(data => {
  const product = convertProductInfoWithPaginationFromServer(data, {
    pagination,
    statusList,
  })
  if (needTag) {
    const tagList = convertTagWithSortListFromServer(data.tagList)
    return {
      ...product,
      productTotal: data.totalCount || 0,
      tagList
    }
  }
  return product
})
/**
 * 获取排序状态下的商品列表
 * @param tagId 
 * @param keyword 
 * @param productStatus 
 * @param pagination 
 * @param sorter 
 */
export const getProductListOnSorting = ({
  poiId,
  tagId,
  keyword,
  status,
  pagination,
  statusList
}: {
  poiId: number,
  tagId: number,
  keyword: string,
  status: PRODUCT_STATUS,
  statusList,
  pagination: Pagination
}) => httpClient.post('retail/r/searchByTag', {
  wmPoiId: poiId,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  needTag: 0,
  name: '',
  brandId: 0,
  tagId,
  searchWord: keyword,
  state: status
}).then(data => convertProductInfoWithPaginationFromServer(data, {
  pagination,
  statusList,
}))
/**
 * 获取商品详细信息
 * @param id 商品id
 * @param poiId 门店id
 */
export const getProductDetail = ({ id, poiId }: { id: number, poiId: number }) => httpClient.post('retail/r/detailProduct', {
  id,
  wmPoiId: poiId
}).then(convertProductDetailFromServer)
/**
 * 类目属性下 获取商品详细信息
 * @param id 商品id
 * @param poiId 门店id
 */
export const getProductDetailWithCategoryAttr = ({ id, poiId }: { id: number, poiId: number }) => httpClient.get('shangou/r/detailProduct', {
  spuId: id,
  wmPoiId: poiId,
}).then(convertProductDetailWithCategoryAttrFromServer)
/**
 * 提交商品
 * @param poiId 门店id
 * @param product 商品
 * @param context 其余配置
 */
export const submitEditProduct = ({ poiId, product, context }: { poiId: number, product: Product, context }) => {
  const newProduct = convertProductDetailToServer(product);
  const params: any = {
    ...newProduct,
    wm_poi_id: poiId
  }
  const { entranceType, dataSource, validType = 0 } = context
  params.validType = validType
  if (entranceType && dataSource) {
    params.entranceType = entranceType
    params.dataSource = dataSource
  }
  if (product.video && product.video.id) {
    params.wmProductVideo = JSON.stringify(convertProductVideoToServer(product.video));
  }
  return httpClient.post('retail/w/saveOrUpdateProduct', params)
}
/**
 * 提交商品带类目属性的
 * @param poiId 门店id
 * @param product 商品
 * @param context 其余配置
 */
export const submitEditProductWithCategoryAttr = ({ poiId, product, context }: { poiId: number, product: Product, context }) => {
  const newProduct = convertProductDetailWithCategoryAttrToServer(product)
  const params: any = {
    ...newProduct,
    wmPoiId: poiId,
  }
  const { entranceType, dataSource, validType = 0 } = context
  params.validType = validType
  if (entranceType && dataSource) {
    params.entranceType = entranceType
    params.dataSource = dataSource
  }
  if (product.video && product.video.id) {
    params.wmProductVideo = JSON.stringify(convertProductVideoToServer(product.video));
  }
  return httpClient.post('shangou/w/saveOrUpdateProduct', params)
}
/**
 * 获取商品的label
 * @param poiId 门店id
 */
export const getProductLabelList = ({ poiId }: { poiId: number }) => httpClient.get('retail/r/label', {
  wmPoiId: poiId
}).then(convertProductLabelListFromServer)
/**
 * 获取门店的商品排序的状态
 * @param tagId 分类id
 * @param poiId 门店id
 */
export const getProductSortInfo = ({ tagId, poiId }: { tagId: number, poiId: number }) => {
  tagId = tagId || -1
  return httpClient.post('retail/r/skuSortRule', {
    poiId,
    tagId,
  }).then(data => {
    const { sortType, topCount } = (data || {}) as any
    return {
      tagId,
      isSmart: sortType === 2,
      topCount,
    }
  })
}
/**
 * 更新商品的排序状态
 */
export const submitChangeProductSortType = ({ tagId, isSmartSort, topCount, poiId } : { tagId: number, isSmartSort: boolean, topCount: number, poiId: number }) => httpClient.post('retail/w/skuSortRule', {
  wmPoiId: poiId,
  tagId: tagId || -1,
  sortType: isSmartSort ? 2 : 1,
  topCount,
})
/**
 * 删除商品
 * @param tagId 分类id
 * @param skuIdList skuId列表
 * @param status 商品状态（售卖中/售罄...）
 * @param poiId 门店id
 */
export const submitDeleteProduct = ({ tagId, skuIdList, productStatus, poiId }: { tagId: number, skuIdList: number[], productStatus: PRODUCT_STATUS, poiId: number }) => httpClient.post('food/w/batchDelete', {
  skuIds: skuIdList.join(','),
  opTab: productStatus,
  tagCat: tagId,
  wmPoiId: poiId,
  v2: 1,
  viewStyle: 0,
})
/**
 * 删除商品的某个分类
 * @param spuId 商品id
 * @param tagId 分类id
 * @param poiId 门店id
 */
export const submitDeleteProductTagById = ({ spuId, tagId, poiId }: { spuId: number, tagId: number, poiId: number }) => httpClient.post('retail/w/deleteTagRel', {
  wmPoiId: poiId,
  spuId,
  tagId,
  v2: 1,
  opTab: 0,
  viewStyle: 0,
  tagCat: 0,
})
/**
 * 修改商品售卖状态
 * @param sellStatus 售卖状态
 * @param params
 */
export const submitModProductSellStatus = (sellStatus, { poiId, tagId, spuIdList, skuIdList, productStatus }) => httpClient.post('retail/w/batchSetSellStatus', {
  tagCat: tagId,
  spuIds: spuIdList.join(','),
  skuIds: skuIdList.join(','),
  opTab: productStatus,
  wmPoiId: poiId,
  sellstatus: sellStatus,
  v2: 1,
  viewStyle: 0,
})
/**
 * 修改商品售卖时间
 * @param sellTime 售卖时间
 * @param params
 */
export const submitModProductSellTime = (sellTime, { poiId, tagId, spuIdList, skuIdList, productStatus }) => httpClient.post('food/w/batchUpdateSkuShippingTimeX', {
  tagCat: tagId,
  spuIds: spuIdList.join(','),
  skuIds: skuIdList.join(','),
  opTab: productStatus,
  wmPoiId: poiId,
  shippingTimeX: convertSellTimeToServer(sellTime)
})
/**
 * 修改商品店内分类
 * @param tagIdList 分类id列表
 * @param params
 */
export const submitModProductTag = ({ tagIdList, type }, { poiId, tagId, spuIdList, skuIdList, productStatus }) => httpClient.post('retail/w/batchUpdateMultiTag', {
  tagCat: tagId,
  spuIds: spuIdList.join(','),
  skuIds: skuIdList.join(','),
  opTab: productStatus,
  wmPoiId: poiId,
  tagIds: tagIdList.join(','),
  opType: type
})
/**
 * 修改商品标签
 * @param labelIdList 商品标签
 * @param params
 */
// TODO
export const submitModProductLabel = ({ labelIdList, type }, { poiId, tagId, spuIdList, skuIdList, productStatus }) => httpClient.post('retail/w/label', {
  tagCat: tagId,
  spuIds: spuIdList.join(','),
  skuIds: skuIdList.join(','),
  opTab: productStatus,
  type,
  wmPoiId: poiId,
  labelIds: labelIdList
})
/**
 * 修改商品sku的价格
 * @param price 价格
 * @param params
 */
export const submitModProductSkuPrice = (price, { skuId, poiId }) => httpClient.post('retail/w/updatePrice', {
  skuId,
  wmPoiId: poiId,
  price
})
/**
 * 修改商品sku的库存
 * @param stock 库存
 * @param params
 */
export const submitModProductSkuStock = (stock, { skuIdList, poiId }) => httpClient.post('retail/w/batchUpdateSkuStock', {
  skuIds: skuIdList.join(','),
  wmPoiId: poiId,
  stock
})
/**
 * 修改商品图片
 * @param spuId 商品id
 * @param pictureList 图片数组
 * @param poiId 门店id
 */
export const submitModProductPicture = ({ spuId, pictureList, poiId }) => httpClient.post('retail/w/picture', {
  wmPoiId: poiId,
  spuId,
  pictures: pictureList,
})
/**
 * 修改商品标题
 * @param spuId 商品id
 * @param name 商品名称
 * @param poiId 门店id
 */
export const submitModProductName = ({ spuId, name, poiId }) => httpClient.post('retail/w/updateSpuName', {
  wmPoiId: poiId,
  spuId,
  spuName: name
})
/**
 * 商品排序
 * @param spuId 商品id
 * @param sequence 顺序
 * @param param2 {poiId: 门店id, tagId: 店内分类id}
 */
export const submitUpdateProductSequence = ({
  spuId,
  sequence,
  poiId,
  tagId,
}) => httpClient.post('food/w/updateSpuSequence', {
  wmPoiId: poiId,
  tagId,
  spuId,
  sequence
})
/**
 * 商品置顶/取消
 * @params:
 * type: 操作类型，1-置顶；2-取消；
 * tagId: 分类id；
 * spuId
 */
export const submitToggleProductToTop = ({
  isSmartSort, tagId, spuId, sequence, poiId
}: { isSmartSort: boolean, tagId, spuId, sequence, poiId: number }) => httpClient.post('retail/w/spuToTop', {
  type: isSmartSort ? TOP_STATUS.TOP : TOP_STATUS.NOT_TOP,
  tagId,
  spuId,
  seq: sequence,
  wmPoiId: poiId
})
/**
 * 商品扩展信息申报
 * @param params
 */
export const submitApplyProductInfo = (params) => {
  const { wmPoiId, pictureList, name, value } = params;
  const query = {
    wmPoiId,
    attrName: name,
    attrValue: value,
    productPic: pictureList[0] || '',
    productBackPic: pictureList[1] || '',
    packPic: pictureList[2] || '',
  };
  return httpClient.upload('shangou/w/saveApplyAttr', query)
}
