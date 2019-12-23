import {
  MedicineDetailProduct,
} from '../../../interface/product'

import {
  convertMedicineCategoryAttrValueMap,
} from '../utils'
import { trimSplit } from '@/common/utils'

const convertTags = (tags = []) => {
  return tags.map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    appTagCode: tag.code,
    level: tag.level
  }))
}

export const convertProductDetail = data => {
  const valueMap = convertMedicineCategoryAttrValueMap(data.categoryAttrList, data.wmProductSpuExtendMap)
  const categoryNamePath = trimSplit(data.categoryNamePath || '')
  const node: MedicineDetailProduct = {
    type: data.type,
    spId: data.wm_product_standard_id,
    id: data.wm_food_spu_id,
    skuId: data.id, // 药品skuId
    name: data.name || '', // 药品名称
    upcCode: data.upc_code || '', // 药品UPC
    tagList: convertTags(data.tags || []), // 药品分类
    category: {
      id: data.categoryId,
      name: categoryNamePath[categoryNamePath.length - 1],
      idPath: trimSplit(data.categoryIdPath).map(v => +v),
      namePath: categoryNamePath
    }, // 后台分类
    spec: data.spec || '', // 规格
    sourceFoodCode: data.source_food_code || '', // SKU码/货号
    sellStatus: +data.sell_status || 0, // 售卖状态
    suggestedPrice: data.ori_price || 0, // 指导价
    price: data.price || 0, // 价格
    stock: data.stock || 0, // 库存
    pictureList: (data.wmProductPics || []).map(pic => pic.pic_large_url), // 商品图片地址
    categoryAttrList: data.categoryAttrList, // 类目属性
    categoryAttrValueMap: valueMap, // 类目属性属性值
  }
  return node
}
