import { defaultTo } from 'lodash'
import { isEmpty } from '@/common/utils'
import {
  Product,
  ProductAttribute,
  ProductVideo,
  Sku
} from '../../../interface/product'
import {
  SELLING_TIME_TYPE
} from '../../../enums/product'

/*
 * 转换视频数据格式-转出
 */
export const convertProductVideoToServer = (video: ProductVideo) => {
  const { src, poster, size, duration, ...rest } = (video || {}) as any
  return {
    url_mp4: src,
    main_pic_small_url: poster,
    length: duration,
    size,
    ...rest
  }
}
// product 是为了错误监控sellTime为undefined
export const convertSellTime = (sellTime, product?: Product) => {
  if (typeof sellTime === 'undefined') {
    throw new Error('product.sellTime为undefined:' + JSON.stringify(product))
  }
  const { type = SELLING_TIME_TYPE.Infinite, timeZone } = sellTime
  if (type === SELLING_TIME_TYPE.Infinite) {
    return '-'
  }
  const { days, timeList = [] } = timeZone
  const result = [[], [], [], [], [], [], []] as any;
  days.forEach(d => {
    result[d] = timeList.map(({ start, end }) => `${start}-${end}`)
  })
  return JSON.stringify(result);
}

export const convertProductLabelList = (list) => {
  list = list || []
  return list.map(item => ({
    group_id: item.value,
    sub_attr: 0,
  }))
}

export const convertAttributeList = (attributeList: ProductAttribute[], spuId) => {
  if (attributeList && attributeList.length > 0) {
    let idx = 0;
    return attributeList.reduce((list, { name, value }) => {
      const targetList = value.filter(v => !!(v && v.trim())).map(val => ({
        id: '',
        wm_product_spu_id: spuId,
        spuId,
        no: idx,
        name,
        value: val,
      }));
      idx += 1;
      return ([] as any[]).concat(list, targetList);
    }, []);
  }
  return [];
}

export const convertProductSkuList = (skuList: Sku[]) => {
  skuList = skuList || []
  return skuList.map(sku => {
    const node = {
      id: sku.id,
      spec: sku.specName,
      price: defaultTo(sku.price.value, ''),
      unit: sku.price.unit,
      stock: isEmpty(sku.stock) ? 0 : sku.stock,
      weight: isEmpty(sku.weight.value) ? -1 : sku.weight.value,
      weight_unit: sku.weight.unit,
      // 包装袋 阶梯计价 https://km.sankuai.com/page/243423506
      wmProductLadderBoxPrice: {
        status: 1,
        ladder_price: Number(sku.box.price) || 0,
        ladder_num: Number(sku.box.count) || 1,
      },
      // ladderPrice: Number(sku.box.price) || 0,
      // ladderNum: Number(sku.box.count) || 1,
      upc_code: sku.upcCode || '',
      source_food_code: sku.sourceFoodCode || '',
      locator_code: sku.shelfNum || '',
      attrList: ([] as object[]),
      min_order_count: defaultTo(sku.minOrderCount, 1)
    }
    if (sku.categoryAttrList) {
      node.attrList = sku.categoryAttrList.map(attr => {
        const {
          parentId: attrId,
          parentName: attrName,
          name,
          sequence,
          isCustomized
        } = attr;
        let id = attr.id
        if (isCustomized) {
          id = ''
        }
        return ({
          no: sequence,
          name: attrName,
          name_id: attrId,
          value: name,
          value_id: id,
        });
      })
    }
    return node
  })
}

export const convertProductDetail = (product: Product) => {
  const brand = product.brand || {} as any
  const origin = product.origin || {} as any
  const node = {
    id: product.id,
    name: product.name,
    spName: product.name,
    description: product.description,
    picContent: (product.pictureContentList || []).join(','),
    spPicContentSwitch: (product.pictureContentList && product.pictureContentList.length) ? Number(product.spPictureContentSwitch) : 1, // 如果图片详情为空，则默认打开给买家展示品牌商图片详情的开关
    shipping_time_x: convertSellTime(product.shippingTime),
    wmProductSkus: JSON.stringify(convertProductSkuList(product.skuList)),
    attrList: JSON.stringify(convertAttributeList(product.attributeList || [], product.id)),
    picture: product.pictureList.join(','),
    labelList: JSON.stringify(convertProductLabelList(product.labelList)),
    min_order_count: product.minOrderCount,
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0, // 关联标品为1，关联非标为2，未关联为0
    spId: product.spId === undefined ? null : product.spId,
    upcCode: product.upcCode,
    categoryId: product.category.id,
    categoryName: product.category.name,
    origin: origin.id,
    originName: origin.name,
    brandId: brand.id,
    spBrandId: brand.spBrandId,
    brandSourceType: brand.type,
    brandName: brand.name,
    sourceFoodCode: product.sourceFoodCode,
    releaseType: product.releaseType,
    tagList: JSON.stringify((product.tagList || []).map(item => ({ tagId: item.id, tagName: item.name }))),
    sellStatus: product.sellStatus,
    saleType: product.preSale && product.preSale.saleType,
    deliveryTime: product.preSale && product.preSale.deliveryTime
  }
  return node
}
