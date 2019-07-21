import { defaultTo } from 'lodash'
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
  const { src, poster, ...rest } = (video || {}) as any
  return {
    url_ogg: src,
    main_pic_small_url: poster,
    ...rest
  }
}

export const convertSellTime = (sellTime) => {
  const { type, timeZone } = sellTime
  if (type === SELLING_TIME_TYPE.Infinite) {
    return '-'
  }
  const { days, timeList } = timeZone;
  const result = days.forEach(d => {
    result[d + 1] = timeList.map(({ start, end }) => `${start}-${end}`)
  })
  return JSON.stringify(result)
}

export const convertProductLabelList = (list) => {
  list = list || []
  list.map(id => ({
    group_id: id,
    sub_attr: 0,
  }))
  return list
}

export const convertAttributeList = (attributeList: ProductAttribute[], spuId) => {
  if (attributeList && attributeList.length > 0) {
    let idx = 0;
    return attributeList.reduce((list, { name, value }) => {
      const targetList = value.filter(v => !!(v && v.trim())).map(val => ({
        id: '',
        wm_product_spu_id: spuId,
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
      id: (/\d+/).test(sku.id.toString()) ? sku.id : '',
      spec: sku.specName,
      price: defaultTo(sku.price, ''),
      stock: sku.stock,
      weight: sku.weight.value,
      weight_unit: sku.weight.unit,
      box_price: sku.box.price,
      box_num: sku.box.count,
      upc_code: sku.upcCode,
      source_food_code: sku.sourceFoodCode,
      locator_code: sku.shelfNum,
      attrList: ([] as object[] )
    }
    if (sku.categoryAttrList) {
      node.attrList = sku.categoryAttrList.map(attr => {
        const {
          parentId: attrId,
          parentName: attrName,
          id,
          name,
          sequence
        } = attr;
        return ({
          no: sequence,
          name: attrName,
          name_id: attrId,
          value: name,
          value_id: id,
        });
      })
    }
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
    shipping_time_x: convertSellTime(product.shippingTime),
    wmProductSkus: JSON.stringify(convertProductSkuList(product.skuList)),
    attrList: JSON.stringify(convertAttributeList(product.attributeList || [], product.id)),
    picture: product.pictureList.join(','),
    labelList: JSON.stringify(convertProductLabelList(product.labelList)),
    min_order_count: product.minOrderCount,
    isSp: product.isSp,
    spId: product.spId,
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
    tagList: JSON.stringify(product.tagList || [])
  }
  return node
}
