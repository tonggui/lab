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
  const node: ProductInfo = {
    id,
    name,
    pictureList: pictures,
    upcCode,
    description,
    sellCount,
    sellStatus,
    tagCount,
    likeCount,
    sku: convertProductSkuList(wmProductSkus)
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