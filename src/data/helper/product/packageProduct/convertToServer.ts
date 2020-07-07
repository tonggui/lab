import { PackageProductInfo, PackageProductUnit } from '@/data/interface/product'
import {
  convertProductLabelList,
  convertSellTime
} from '@/data/helper/product/base/convertToServer'
import { convertLimitSale } from '@/data/helper/common/convertToServer'

export const convertPackageProductUnitToServer = (data: PackageProductUnit) => {
  const node = {
    id: data.id,
    spuId: data.spuId,
    name: data.name,
    spec: data.spec,
    upc: data.upc,
    stock: data.stock,
    price: data.price,
    discount: data.discount,
    count: data.count,
    sellStatus: data.sellStatus
  }
  return node
}

export const convertPackageProductToServer = (packageProduct: PackageProductInfo) => {
  const node = {
    id: packageProduct.id,
    name: packageProduct.name,
    description: packageProduct.description,
    picContent: (packageProduct.pictureContentList || []).join(','),
    shippingTimeX: convertSellTime(packageProduct.shippingTime),
    picture: packageProduct.pictureList.join(','),
    labels: JSON.stringify(convertProductLabelList(packageProduct.labelList)),
    categoryId: packageProduct.categoryId,
    tagList: JSON.stringify((packageProduct.tagList || []).map(item => ({ tagId: item.id, tagName: item.name }))),
    limitSale: convertLimitSale(packageProduct.limitSale),

    suitableScene: packageProduct.suitableScene,
    stock: packageProduct.stock,
    price: packageProduct.price,
    combinationSpus: packageProduct.productList.map(convertPackageProductUnitToServer)
  }
  return node
}
