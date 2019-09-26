import {
  ProductInfo,
  Product,
  Sku,
  ProductVideo
} from '../../../interface/product'
import {
  convertPoorPictureList,
  convertProductAttributeList,
  convertProductSellTime
} from '../utils'
import {
  PRODUCT_INFINITE_STOCK
} from '@/data/constants/product'
import {
  PRODUCT_SELL_STATUS
} from '@/data/enums/product'
import { isMedicine } from '@/common/app'
import { trimSplit } from '@/common/utils'

/*
 * 转换视频数据格式-转入
 */
export const convertProductVideoFromServer = (video: any): ProductVideo => {
  const { url_ogg = '', main_pic_small_url = '', title = '', length = 0, size = 0, ...rest } = video || {}
  const node: ProductVideo = {
    src: url_ogg,
    poster: main_pic_small_url,
    size,
    title,
    duration: length,
    ...rest
  }
  return node
}

const isSpByType = (type) => type === 1 || type === '1' 

export const convertProductDetail = data => {
  const isSp = isSpByType(data.isSp);

  const node: Product = {
    id: data.spuId,
    name: data.name,
    brand: {
      id: data.brandId,
      name: data.brandName,
      type: data.brandSourceType,
      spBrandId: data.spBrandId
    },
    origin: {
      id: data.origin,
      name: data.originName
    },
    category: {
      id: data.categoryId,
      idPath: trimSplit(data.categoryIdPath).map(v => +v),
      name: data.categoryName,
      namePath: trimSplit(data.categoryNamePath)
    },

    tagList: data.tagList.map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),

    pictureList: trimSplit(data.wmProductPics),
    video: convertProductVideoFromServer(data.wmProductVideo),
    poorPictureList: convertPoorPictureList(data.poorImages),

    upcCode: (data.spId > 0 && !isSp) ? '' : data.upc_code,

    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp,
    labelList: (data.labelList || []).map(i => (i.group_id || i.groupId)),
    attributeList: convertProductAttributeList(data.attrList || []),
    shippingTime: convertProductSellTime(data.shipping_time_x),
    pictureContentList: trimSplit(data.picContent),
    minOrderCount: data.min_order_count || 1,
    sourceFoodCode: data.sourceFoodCode,
    releaseType: data.releaseType,
    skuList: convertProductSkuList(data.wmProductSkus)
  }
  return node
}

export const convertProductSku = (sku: any): Sku => {
  const node: Sku = {
    id: sku.id,
    __id__: sku.id,
    specName: sku.spec,
    editable: true,
    price: {
      value: sku.price,
      unit: sku.unit || '份'
    },
    weight: {
      value: sku.weight,
      unit: sku.weight_unit || '克(g)'
    },
    stock: sku.stock,
    box: {
      price: sku.box_price,
      count: sku.box_num
    },
    upcCode: sku.upc_code,
    sourceFoodCode: sku.source_food_code,
    shelfNum: sku.locator_code
  }
  return node
}

export const convertProductSkuList = (list: any[]): Sku[] => {
  list = list || []
  return list.map(convertProductSku)
}

export const convertProductInfo = (product: any): ProductInfo => {
  const {
    id,
    name,
    pictures,
    upcCode,
    description,
    sellCount,
    tagCount,
    sellStatus,
    wmProductSkus,
    likeCount,
    picture,
    fillOrCheck,
    smartSort,
    wmProductVideo
  } = product
  const skuList = convertProductSkuList(wmProductSkus)
  // 是否下架
  const notBeSold = product.isStopSell === 1 || sellStatus === 1
  let stock = 0 // 库存 累加形式
  let priceList: number[] = [] // 价格集合 价格要sku聚合 min - max
  skuList.forEach(sku => {
    if (sku.stock === PRODUCT_INFINITE_STOCK) {
      stock = PRODUCT_INFINITE_STOCK
    } else if (stock !== PRODUCT_INFINITE_STOCK) {
      stock += sku.stock
    }
    sku.price.value && priceList.push(sku.price.value)
  })
  // 价格要sku聚合 min - max
  let priceStr: string = `${priceList[0]}`
  if (priceList.length > 1) {
    const maxPrice = Math.max.apply(null, priceList);
    const minPrice = Math.min.apply(null, priceList);
    priceStr = `${minPrice}-${maxPrice}`
  }
  // 设置基本信息要展示的字段
  const displayInfo: (string|string[])[] = [];
  const spuExtends = product.wmProductSpuExtends || {}
  const isOTC = +(spuExtends['1200000081'] || {}).value === 1 // 处方类型（是否OTC）
  if (isMedicine()) {
    const sourceFoodCode = `${skuList[0].sourceFoodCode || ''}` // 货号
    const permissionNumber = `${(spuExtends['1200000086'] || {}).value || ''}` // 批准文号
    // 药品基本信息中展示批准文号、货号、UPC
    displayInfo.push([permissionNumber, sourceFoodCode], [upcCode]);
  } else {
    // 商超基本信息中展示月售和赞
    displayInfo.push([`月售 ${sellCount}`, `赞 ${likeCount}`]);
  }
  const node: ProductInfo = {
    id,
    name,
    picture: picture || '',
    pictureList: pictures,
    upcCode,
    isStopSell: product.isStopSell === 1,
    description,
    skuList,
    sellStatus: notBeSold ? PRODUCT_SELL_STATUS.OFF : PRODUCT_SELL_STATUS.ON,
    tagCount,
    isNeedCheck: fillOrCheck === 2,
    isNeedFill: fillOrCheck === 1,
    isSmartSort: !!smartSort,
    stock,
    priceStr,
    displayInfo,
    isOTC: isMedicine() ? isOTC : false,
    video: convertProductVideoFromServer(wmProductVideo)
  }
  return node
}

export const convertProductInfoList = (list: any[]): ProductInfo[] => {
  list = list || []
  return list.map(convertProductInfo)
}

export const convertProductInfoWithPagination = (data: any, requestQuery) => {
  const {
    queryCount,
    productList,
    totalCount,
    topCount,
    spuSortType // 1: 手动排序 2: 智能排序
  } = (data || {}) as any;
  const { pagination, statusList } = requestQuery
  console.log('fetchGetProductInfoList:', statusList)
  return {
    list: convertProductInfoList(productList),
    pagination: {
      ...pagination,
      total: totalCount,
    },
    statusList: statusList.map((node) => {
      const count = queryCount[node.key];
      return {
        ...node,
        count,
      };
    }),
    sortInfo: {
      isSmartSort: spuSortType === 2,
      topCount: topCount || 0
    }
  };
}
