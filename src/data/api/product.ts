import httpClient from '../client/instance/product'
import defaultTo from 'lodash/defaultTo'
import {
  Pagination
} from '../interface/common'
import {
  Product,
  ApiAnomalyType,
  CellularProduct
} from '../interface/product'
import {
  TOP_STATUS
} from '../enums/common'
import {
  PRODUCT_STATUS,
  PRODUCT_AUDIT_STATUS
} from '../enums/product'
import {
  convertProductInfoWithPagination as convertProductInfoWithPaginationFromServer,
  convertAuditProductInfoList as convertAuditProductInfoListFromServer,
} from '../helper/product/base/convertFromServer'
import {
  convertSellTime as convertSellTimeToServer,
} from '../helper/product/base/convertToServer'
import {
  convertProductDetail as convertProductDetailWithCategoryAttrFromServer
} from '../helper/product/withCategoryAttr/convertFromServer'
import {
  convertAuditProductDetail
} from '../helper/product/auditProduct/convertFromServer'
import {
  convertCellularProductListFromServer
} from '../helper/product/cellularProduct/convertFromServer'
import {
  convertProductLabelList as convertProductLabelListFromServer
} from '../helper/product/utils'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertProductFormToServer as convertProductFromWithCategoryAttrToServer,
} from '../helper/product/withCategoryAttr/convertToServer'
import {
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer'
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
export const getSearchSuggestion = ({ poiId, keyword, auditStatus }: { poiId: number, keyword: string, auditStatus: PRODUCT_AUDIT_STATUS[] }) => httpClient.post('retail/r/searchSug', {
  wm_poi_id: poiId,
  keyword,
  bizAuditStatus: auditStatus
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
}) => httpClient.post('retail/r/searchByCond', {
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
 * 类目属性下 获取商品详细信息
 * @param id 商品id
 * @param poiId 门店id
 */
export const getProductDetailWithCategoryAttr = ({ id, poiId }: { id: number, poiId: number }) => httpClient.get('shangou/r/detailProduct', {
  spuId: id,
  wmPoiId: poiId,
}).then(convertProductDetailWithCategoryAttrFromServer)
/**
 * 获取商品审核详情
 * @param id 商品id
 * @param poiId 门店id
 */
export const getAuditProductDetail = ({ id, poiId }: { id: number, poiId: number }) => httpClient.post('shangou/audit/r/detail', {
  spuId: id,
  wmPoiId: poiId,
}).then(convertAuditProductDetail)
/**
 * 获取商品是否命中需送审的条件
 * @param categoryId 类目id
 * @param poiId 门店id
 */
export const getNeedAudit = ({ categoryId, poiId }: { categoryId: number, poiId: number }) => httpClient.post('shangou/audit/r/needAudit', {
  categoryId,
  wmPoiId: poiId,
}).then((data = { meetPoiCondition: false, meetCategoryCondition: false }) => ({ poiNeedAudit: !!data.meetPoiCondition, categoryNeedAudit: !!data.meetCategoryCondition }))

/**
 * 获取商品类目申报信息
 * @param id 商品id
 * @param poiId 门店id
 */
export const getCategoryAppealInfo = ({ id, poiId }: { id: number, poiId: number }) => httpClient.post('shangou/category/r/getCategoryAppealInfo', {
  spuId: id,
  wmPoiId: poiId,
})

/**
 * 提交商品带类目属性的
 * @param poiId 门店id
 * @param product 商品
 * @param context 其余配置
 */
export const submitEditProductWithCategoryAttr = ({ poiId, product, context }: { poiId: number, product: Product, context }) => {
  const params = convertProductFromWithCategoryAttrToServer({ poiId, product, context })
  return httpClient.post('shangou/w/saveOrUpdateProduct', params)
}

/**
 * 用户撤销商品审核
 * @param poiId 门店id
 * @param spuId 商品id
 */
export const submitRevocation = ({ id, poiId }: { id:number, poiId: number }) => {
  return httpClient.post('shangou/audit/w/cancel', {
    spuId: id,
    wmPoiId: poiId
  })
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
}).then(data => {
  const { errorModels = [], msg = '' } = data || {}
  if (!msg) {
    return
  }
  let tip = {
    type: 'warning',
    message: msg
  }
  if (errorModels.length <= 0) {
    tip.type = 'success'
  }
  return { needTip: true, tip }
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
 * type: 操作类型，1-置顶；2-取消 0-推到最前面；
 * tagId: 分类id；
 * spuId
 */
export const submitToggleProductToTop = ({
  type, tagId, spuId, sequence, poiId
}: { type: TOP_STATUS, tagId, spuId, sequence, poiId: number }) => httpClient.post('retail/w/spuToTop', {
  type,
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
/**
 * 异常列表查询
 * @param poiId 门店id
 * @param type 异常列表类型：1-价格；2-库存；3-滞销；
 * @param pagination
 */
export const getAnomalyList = ({
  poiId,
  type,
  pagination
}: {
  poiId: number,
  type: ApiAnomalyType,
  pagination: Pagination
}) => httpClient.post('retail/r/getAnomalyList', {
  wmPoiId: poiId,
  type,
  pageNo: pagination.current,
  pageSize: pagination.pageSize
})

/**
 * 下架商品 - 异常商品处理页
 * @param poiId
 * @param spuId
 */
export const submitSetSellStatus = ({ poiId, spuId }) => httpClient.post('retail/w/setSellStatusBySpuId', {
  wmPoiId: poiId,
  spuId: spuId
})

/**
 * 价格异常列表中，核对价格，确认商品与价格无误
 * @param skuId
 */
export const submitCheckPrice = skuId => httpClient.post('retail/w/checkPrice', {
  skuId: skuId
})

/**
 * 修改分类 - 滞销商品处理页
 * @param tagId
 * @param spuIds
 * @param wmPoiId
 * @param v2 传1
 * @param opTab 传0
 * @param viewStyle 传0
 */
export const submitUpdateTag = spu => httpClient.post('retail/w/batchUpdateTag', spu)

/**
 * 商品申报
 * @param params
 */
export const submitApplyProduct = (params) => {
  const { wmPoiId, pictureList, name } = params;
  const query = {
    wmPoiId,
    productName: name,
    pictures: pictureList.join(',')
  };
  return httpClient.upload('retail/w/addProductMisLog', query)
}

export const submitModProductStockoutAutoClearStock = (params) => {
  const { spuId, poiId, productStockConfig } = params
  return httpClient.post('retail/w/saveStockConfig', {
    wmPoiId: poiId,
    spuId,
    productStockConfig: JSON.stringify(productStockConfig)
  })
}

export const getAuditProductList = ({ poiId, pagination, searchWord, auditStatus } : {
  poiId: number,
  pagination: Pagination,
  searchWord: string,
  auditStatus: PRODUCT_AUDIT_STATUS[]
}) => httpClient.post('shangou/audit/r/list', {
  wmPoiId: poiId,
  auditStatus,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  searchWord: searchWord || ''
}).then(data => {
  const { totalCount, productList = [] } = (data || {}) as any
  return {
    pagination: {
      ...pagination,
      total: totalCount || 0
    },
    list: convertAuditProductInfoListFromServer(productList)
  }
})

export const submitCancelProductAudit = ({ spuId, poiId } : { spuId: number, poiId: number }) => httpClient.post('shangou/audit/w/cancel', { spuId, wmPoiId: poiId })

// 获取蜂窝缺失下架商品 不同状态的商品数量（已有商品，新商品）
// TODO 接口url暂定
export const getCellularProductStatistics = ({ spuId, poiId } : { spuId: number, poiId: number }) => httpClient.get('r/cellularProductStatistics', {
  spuId,
  wmPoiId: poiId
}).then(data => {
  const { unSellSpIds = [], notExistInPoiSpIds = [] } = data || {}
  return {
    existProductCount: unSellSpIds.length,
    newProductCount: notExistInPoiSpIds.length
  }
})
// TODO 接口url暂定
// status 1-已有商品，2-新商品
export const getCellularProductList = ({ spuId, keyword, pagination, status, poiId } : { spuId: number, keyword: string, pagination: Pagination, status: number, poiId: number }) => httpClient.get('r/cellularExistProductList', {
  wmPoiId: poiId,
  spuId,
  keyword,
  pageSize: pagination.pageSize,
  page: pagination.current,
  tabs: status // 1-已有商品，2-新商品
}).then(data => {
  const { totalCount, productList } = (data || {}) as any
  return {
    list: convertCellularProductListFromServer(productList), // TODO convert
    pagination: {
      ...pagination,
      total: totalCount
    }
  }
})

// TODO 接口暂定
// 获取蜂窝缺失新商品是否匹配店内分类
export const getCellularNewProductIsMatchTag = ({ spuId, poiId } : { spuId: number, poiId: number }) => httpClient.get('r/cellularNewProductMatch', {
  spuId,
  wmPoiId: poiId
})

export const submitCellularProductPuton = ({ product, spuId, poiId } : { product: CellularProduct, spuId: number, poiId: number }) => httpClient.post('w/celluarProductPutOn', {
  product,
  spuId,
  wmPoiId: poiId
})
