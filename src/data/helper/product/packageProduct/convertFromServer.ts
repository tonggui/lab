import {
  convertPoorPictureList,
  convertProductSellTime
} from '@/data/helper/product/utils'
import { PackageProductInfo, PackageProductUnit } from '@/data/interface/product'
import { trimSplit } from '@/common/utils'
import get from 'lodash/get'
import { convertProductLabel } from '@/data/helper/product/base/convertFromServer'
import { convertLimitSale } from '@/data/helper/common/convertFromServer'
import { convertToBaseCategory } from '@/data/helper/category/convertFromServer'

export const convertPackageProductUnit = (data): PackageProductUnit => {
  const node: PackageProductUnit = {
    id: data.id,
    spuId: data.spuId,
    name: data.name,
    spec: data.spec,
    upc: data.upc,
    sourceFoodCode: data.sourceFoodCode,
    stock: data.stock,
    price: data.price,
    discount: data.discount,
    count: data.count,
    sellStatus: data.sellStatus,
    category: convertToBaseCategory(data.category || {}),
    pictureList: trimSplit(data.picture),
    isPrescription: data.prescriptionLabel === 1
  }
  return node
}

export const convertPackageProductDetail = (data) : PackageProductInfo => {
  const node: PackageProductInfo = {
    id: data.id,
    skuId: data.skuId,
    name: data.name,
    categoryId: get(data, 'category.categoryId'),
    pictureList: trimSplit(data.picture),
    poorPictureList: convertPoorPictureList(data.poorImages),
    description: data.description || '',
    tagList: (data.tagList || []).map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    labelList: (data.labels || []).map(convertProductLabel),
    shippingTime: convertProductSellTime(data.shippingTimeX),
    pictureContentList: trimSplit(data.picContent),
    limitSale: convertLimitSale(data.limitSale),

    // 独有属性
    suitableScene: data.suitableScene, // 场景标题
    price: data.price, // 组包商品价钱
    stock: data.stock, // 组包商品库存
    productList: (data.combinationSpus || []).map(convertPackageProductUnit), // 组包商品的商品列表

    // B2C医药单店
    shippingTemplateId: data.shippingTemplateId, // 组包运费模板id
    shippingTemplateName: data.shippingTemplateName
  }
  return node
}