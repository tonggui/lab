import {
  Product,
  ProductAttribute
} from '../../../interface/product'
import {
  SELLING_TIME_TYPE
} from '../../../enums/product'

export const convertSellTime = (sellTime) => {
  const { type, timeList } = sellTime
  if (type === SELLING_TIME_TYPE.Infinite) {
    return '-'
  }
  const result = [];
  timeList.forEach(v => {
    const { day, timezone } = v
    result[day] = timezone.map(({ start, end }) => {
      return `${start}-${end}`
    })
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
      return [].concat(list, targetList);
    }, []);
  }
  return [];
}

export const convertProductSkuList = (skuList) => {
  skuList = skuList || []
  return skuList.map(sku => {
    return {
      id: sku.id,
      spec: sku.specName,
      price: +sku.price,
      stock: +sku.stock,
      weight: +sku.weight.value,
      weight_unit: sku.weight.unit,
      box_price: +sku.box.price,
      box_num: +sku.box.count,
      upc_code: sku.upcCode,
      source_food_code: sku.sourceFoodCode,
      locator_code: sku.shelfNum,
      attrList: sku.categoryAttrList.map(attr => {
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
  const node = {
    id: product.id,
    name: product.name,
    spName: product.name,
    description: product.description,
    picContent: product.pictureContentList.join(','),
    shipping_time_x: convertSellTime(product.shippingTime),
    wmProductSkus: JSON.stringify(convertProductSkuList(product.skuList)),
    attrList: JSON.stringify(convertAttributeList(product.attributeList, product.id)),
    picture: product.pictureList.join(','),
    labelList: JSON.stringify(convertProductLabelList(product.labelList)),
    min_order_count: product.minOrderCount,
    isSp: product.isSp,
    spId: product.spId,
    upcCode: product.upcCode,
    categoryId: product.category.id,
    categoryName: product.category.name,
    origin: product.origin.id,
    originName: product.origin.name,
    brandId: product.brand.id,
    spBrandId: product.brand.spBrandId,
    brandSourceType: product.brand.type,
    brandName: product.brand.name,
    sourceFoodCode: product.sourceFoodCode,
    releaseType: product.releaseType,
    tagList: JSON.stringify(product.tagList || [])
  }
  return node
}