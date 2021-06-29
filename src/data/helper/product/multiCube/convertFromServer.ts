import { MultiCubeProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { QUALIFICATION_STATUS } from '../../../enums/product'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'
import { Tag } from '@/data/interface/category'

// 后端返回的算法推荐的商品信息 是拍平的信息，没有skus，需要自己组合一下
export const convertMultiCubeProduct = (product): MultiCubeProduct => {
  const { spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs } = product
  const skus = [{
    spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs
  }]
  return convertMultiCubeEditProduct({
    ...product,
    skus
  })
}

export const convertMultiCubeProductList = (list: MultiCubeProduct[], tabId: string = '', tagSource: number = 0) => (list || []).map(convertMultiCubeProduct).map(product => {
  product.tabId = tabId
  product.tagSource = tagSource
  return product
})
export const convertMultiCubeEditProduct = (product): MultiCubeProduct => {
  const {
    isExist,
    poiSpuId,
    name,
    tagList,
    isSp,
    spId,
    skus,
    picture,
    upcCode,
    retailPrice,
    lockStatus,
    lockTips,
    sourceLabelIds,
    sourceLabel,
    isDelete,
    labelVo,
    isHqExist,
    relatedPoiIds,
    totalPoiIds,
    merchantSpuId
  } = product
  let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
  if (!poiSpuId) {
    skuList = skuList.map(s => {
      const sku:CellularProductSku = {
        ...s,
        price: { ...s.price, value: undefined, defaultValue: retailPrice > 0 ? retailPrice : undefined },
        stock: undefined
      }
      return sku
    })
  }
  const list = convertCategoryTemplateTag(typeof tagList === 'string' ? JSON.parse(tagList) : tagList)
  const multiCubeProduct: MultiCubeProduct = {
    __id__: Number(poiSpuId) || spId,
    id: poiSpuId,
    name,
    qualificationStatus: lockStatus || QUALIFICATION_STATUS.YES,
    qualificationTip: lockTips || '',
    tagList: list,
    isSp: isSp === 1,
    spId,
    skuList,
    pictureList: (picture || '').split(','),
    upcCode,
    productLabelIdList: sourceLabelIds || [sourceLabel],
    isDelete: isDelete === 1,
    hotSaleDetailsMap: labelVo,
    isExist: Number(isExist) === 1,
    isHqExist: isHqExist === 1,
    relatedPoiIds,
    totalPoiIds,
    merchantSpuId
  }
  return multiCubeProduct
}

/**
 * 清洗类目列表
 * @param list
 * @param parentId
 */
export const convertCategoryToTagList = (list: any[], parentId?, level?, parentName?): Tag[] => (list || []).map((tag) => convertCategoryToTag(tag, parentId, level, parentName))

/**
 * 清洗类目为tag形式
 * @param tag 店内分类
 * @param parentId 父id
 */
export const convertCategoryToTag = (tag: any, parentId = 0, level = 0, parentName = ''): Tag => {
  const node: Tag = {
    id: tag.tagId,
    name: tag.tagName,
    level: level,
    sequence: tag.sequence,
    parentId,
    parentName,
    children: convertCategoryToTagList(tag.subTags || [], tag.tagId, level + 1, tag.tagName),
    isLeaf: tag.isLeaf || (!tag.subTags || tag.subTags.length <= 0),
    productCount: tag.productCount || 0,
    isUnCategorized: tag.tagName === '未分类'
  }
  return node
}
export const convertMultiCubeEditProductList = (list) => (list || []).map(convertMultiCubeEditProduct)
