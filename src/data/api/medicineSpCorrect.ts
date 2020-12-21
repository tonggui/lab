import _ from 'lodash'
import httpClient from '../client/instance/product'
import { MedicineAuditStandardProduct } from '@/data/interface/product'
import { BaseCategory, CategoryAttr } from '@/data/interface/category'
import { SPECIAL_CATEGORY_ATTR, VALUE_TYPE } from '@/data/enums/category'
import { trimSplit, trimSplitId } from '@/common/utils'
import { getCategoryAttrs } from '@/data/api/medicine'

const convertCategoryFromServer = (category: any): BaseCategory => {
  category = category || {}
  const node: BaseCategory = {
    id: category.categoryId,
    name: category.categoryName,
    idPath: trimSplitId(category.idPath),
    namePath: trimSplit(category.categoryNamePath)
  }
  return node
}


/**
 * 标品申请信息详情
 */
export const spDetail = async ({
  poiId,
  spId
}: {
  poiId: string | number,
  spId: number | string,
}) => {
  const { standardProductVo, tasks } = await httpClient.post('shangou/medicine/recovery/r/detailSp', {
    wmPoiId: poiId,
    spSkuId: spId || 0
  })
  const valueMap = {}
  let categoryAttrList: CategoryAttr[] = []
  if (standardProductVo.category) {
    categoryAttrList = await getCategoryAttrs({ poiId, categoryId: standardProductVo.category.categoryId }, true)
    const attrValueList = standardProductVo.attrValueList || []
    // 清洗支持自定义扩展的数据，清除已选择数据，将数据设置到attrList中，同时设置valueMap
    for (const attrValueItem of attrValueList) {
      const categoryAttrItem = categoryAttrList.find(categoryAttrItem => categoryAttrItem.id === attrValueItem.attrId)
      if (!categoryAttrItem) {
        // 如果未找到对应的类目属性，则过滤属性
        continue
      }
      let value
      if (categoryAttrItem.id === SPECIAL_CATEGORY_ATTR.BRAND) {
        value = {
          id: +attrValueItem.valueId || 0,
          name: attrValueItem.extension || '',
          idPath: [+attrValueItem.valueId || 0],
          namePath: [attrValueItem.extension || '']
        }
      } else {
        switch (categoryAttrItem.valueType) {
          case VALUE_TYPE.INPUT:
            value = attrValueItem.extension
            break
          case VALUE_TYPE.SINGLE_SELECT:
            value = +attrValueItem.valueId || 0
            break
          case VALUE_TYPE.MULTI_SELECT:
            value = _.map(_.split(attrValueItem.valueId, ','), v => +v || 0)
            break
        }
      }
      valueMap[categoryAttrItem.id] = value
    }
  }
  const spProduct: MedicineAuditStandardProduct = {
    spId: +spId,
    name: standardProductVo.name,
    category: convertCategoryFromServer(standardProductVo.category),
    upcList: _.defaultTo(standardProductVo.upcList, []),
    spec: _.defaultTo(standardProductVo.spec, ''),
    suggestedPrice: _.defaultTo(standardProductVo.suggestedPrice, 0),
    tagList: _.defaultTo(standardProductVo.medicineTagList, []),
    pictureList: _.defaultTo(standardProductVo.picList, []),
    pictureDetailList: _.defaultTo(standardProductVo.picDetailList, [])
  }
  return {
    tasks,
    ...spProduct,
    auditStatus: +standardProductVo.auditStatus || 0,
    categoryAttrValueMap: valueMap,
    categoryAttrList
  }
}

export const getSpConfig = async () => {
  const data = await httpClient.post('shangou/medicine/recovery/r/notSupportField')
  const { funcConfig = {}, spuFieldConfig = {}, skuFieldConfig = {}, categoryFieldConfig = [] } = data
  return {
    field: { ...spuFieldConfig },
    skuField: { ...skuFieldConfig },
    categoryFieldConfig: [...categoryFieldConfig],
    features: { ...funcConfig }
  }
}
