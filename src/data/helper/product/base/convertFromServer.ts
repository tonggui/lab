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
  PRODUCT_SELL_STATUS
} from '@/data/enums/product'
import { isMedicine } from '@/common/app'
import { trimSplit } from '@/common/utils'

/*
 * 转换视频数据格式-转入
 */
export const convertProductVideoFromServer = (video: any): ProductVideo => {
  const { url_mp4 = '', main_pic_small_url = '', title = '', length = 0, size = 0, ...rest } = video || {}
  const node: ProductVideo = {
    src: url_mp4,
    poster: main_pic_small_url,
    size,
    title,
    duration: length,
    ...rest
  }
  return node
}

const isSpByType = (type) => type === 1 || type === '1' 

export const convertProductLabel = label => ({
  value: label.groupId || label.group_id,
  label: label.groupName || label.group_name
})

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
    labelList: (data.labelList || []).map(convertProductLabel),
    attributeList: convertProductAttributeList(data.attrList || []),
    shippingTime: convertProductSellTime(data.shipping_time_x),
    pictureContentList: trimSplit(data.picContent),
    spPictureContentList: trimSplit(data.spPicContent),
    spPictureContentSwitch: data.spPicContentSwitch === 1,
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
      unit: sku.weight_unit || '克(g)',
      ignoreMax: false
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

export const convertProductInfo = (product: any, validationConfigMap): ProductInfo => {
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
    fillOrCheck,
    smartSort,
    wmProductVideo,
    labels,
    categoryId,
    isSp,
    spId
  } = product
  let locked = false
  const skuList = convertProductSkuList(wmProductSkus || [])
  // 是否下架
  const notBeSold = product.isStopSell === 1 || sellStatus === 1;
  // 设置基本信息要展示的字段
  const displayInfo: (string|string[])[] = [];
  const spuExtends = product.wmProductSpuExtends || {}
  const isOTC = +(spuExtends['1200000081'] || {}).value === 1 // 处方类型（是否OTC）
  if (isMedicine()) {
    const sourceFoodCode = `${skuList[0].sourceFoodCode || ''}` // 货号
    const permissionNumber = `${(spuExtends['1200000086'] || {}).value || ''}` // 批准文号
    // 药品基本信息中展示批准文号、货号、UPC
    displayInfo.push([permissionNumber, sourceFoodCode], [upcCode]);
    // TODO 药店暂时不处理 locked
  } else {
    // 商超基本信息中展示月售和赞
    displayInfo.push([`月售 ${sellCount}`, `赞 ${likeCount}`]);
    // 字段锁定只针对标品
    if (spId && isSp === 1) {
      locked = validationConfigMap[categoryId] && validationConfigMap[categoryId].propertyEditLock
    }
  }
  let errorTip = ''
  const qualification = {
    exist: true,
    tip: '',
    message: '',
  };
  (labels || []).forEach((label) => {
    const { id, groupName } = label
    if (id === 16) {
      errorTip = '超出经营范围，禁止售卖';
    } else if (id === 15) {
      qualification.exist = false
      qualification.tip = '需补充资质后方可售卖';
      qualification.message = groupName || '需补充资质后方可售卖';
    }
  })
  const node: ProductInfo = {
    id,
    name,
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
    displayInfo,
    isOTC: isMedicine() ? isOTC : false,
    video: convertProductVideoFromServer(wmProductVideo),
    errorTip,
    qualification,
    locked
  }
  return node
}

export const convertProductInfoList = (list: any[], validationConfigMap?: { [propName:string]: any }): ProductInfo[] => {
  list = list || []
  return list.map((item) => convertProductInfo(item, validationConfigMap))
}

export const convertProductInfoWithPagination = (data: any, requestQuery) => {
  const {
    validationConfigMap, // 白名单配置
    queryCount,
    productList,
    totalCount,
    spuTopCount,
    spuSortType // 1: 手动排序 2: 智能排序
  } = (data || {}) as any;
  const { pagination, statusList } = requestQuery
  return {
    list: convertProductInfoList(productList, validationConfigMap),
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
      topCount: spuTopCount || 0
    }
  };
}
