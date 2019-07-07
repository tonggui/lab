import {
  ProductInfo,
  Product,
  Sku,
} from '../../../interface/product'
import {
  convertPoorPictureList,
  convertProductAttributeList,
  convertProductSellTime
} from '../utils'
import {
  PRODUCT_INFINITE_STOCK,
  ProductMark
} from '@/data/constants/product'
import {
  PRODUCT_MARK,
  PRODUCT_SELL_STATUS
} from '@/data/enums/product'
import { isMedicine } from '@/common/app'

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
      idPath: (data.categoryIdPath || '').split(','),
      name: data.categoryName,
      namePath: (data.categoryNamePath || '').split(',')
    },

    tagList: data.tagList.map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),

    pictureList: (data.wmProductPics || '').split(','),
    poorPictureList: convertPoorPictureList(data.poorImages),

    upcCode: (data.spId > 0 && !isSp) ? '' : data.upc_code,

    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp,
    labelList: (data.labelList || []).map(i => (i.group_id || i.groupId)),
    attributeList: convertProductAttributeList(data.attrList || []),
    shippingTime: convertProductSellTime(data.shipping_time_x),
    pictureContentList: (data.picContent || '').splice(','),
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
    specName: sku.spec,
    unit: sku.unit,
    price: sku.price,
    weight: {
      value: sku.weight,
      unit: sku.weight_unit
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
    likeCount
  } = product
  const skuList = convertProductSkuList(wmProductSkus)
  // 是否下架
  const notBeSold = product.isStopSell === 1 || sellStatus === 1
  let markType // 商品打标
  let stock = 0 // 库存 累加形式
  let partSoldOut = false // 部分售磬标志
  let priceList: number[] = [] // 价格集合 价格要sku聚合 min - max
  skuList.forEach(sku => {
    if (sku.stock === PRODUCT_INFINITE_STOCK) {
      stock = PRODUCT_INFINITE_STOCK
    } else if (stock !== PRODUCT_INFINITE_STOCK) {
      stock += sku.stock
    }
    priceList.push(sku.price)
    if (sku.stock === 0) {
      partSoldOut = true
    }
  })
  // 价格要sku聚合 min - max
  let priceStr: string = `${priceList[0]}`
  if (priceList.length > 1) {
    const maxPrice = Math.max.apply(null, priceList);
    const minPrice = Math.min.apply(null, priceList);
    priceStr = `${minPrice}-${maxPrice}`
  }
  // 标签展示优先级：风控下架>已下架>已售罄>部分售罄>图片质量差>需补充>待更新
  if (product.isStopSell === 1) {
    markType = PRODUCT_MARK.RC_SUSPENDED_SALE
  } else if (sellStatus === 1) {
    markType = PRODUCT_MARK.SUSPENDED_SALE
  } else if (stock === 0) {
    markType = PRODUCT_MARK.SOLD_OUT
  } else if (partSoldOut) {
    markType = PRODUCT_MARK.PART_SOLD_OUT
  } else if (product.fillOrCheck === 1) {
    markType = PRODUCT_MARK.NEED_TO_FILL
  } else if (product.fillOrCheck === 2) {
    markType = PRODUCT_MARK.NEED_TO_CHECK
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
    pictureList: pictures,
    upcCode,
    description,
    sku: skuList,
    sellStatus: notBeSold ? PRODUCT_SELL_STATUS.OFF : PRODUCT_SELL_STATUS.ON,
    tagCount,
    mark: ProductMark[markType],
    stock,
    priceStr,
    displayInfo,
    isOTC: isMedicine() ? isOTC : false,
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
  } = (data || {}) as any;
  const { pagination, statusList } = requestQuery
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
    })
  };
}