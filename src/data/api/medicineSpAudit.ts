import _ from 'lodash'
import httpClient from '../client/instance/product'
import { MedicineAuditStandardProduct } from '@/data/interface/product'
import { CategoryAttr, StandardProductCategoryAttrValue } from '@/data/interface/category'
import { VALUE_TYPE } from '@/data/enums/category'

const convertCategoryToServer = (categoryAttrValueMap, categoryAttrList: CategoryAttr[]) => {
  const result: StandardProductCategoryAttrValue[] = []
  Object.entries(categoryAttrValueMap || {})
    .forEach(([key, value]: [string, number | string | number[]]) => {
      const attr = categoryAttrList.find((attr: CategoryAttr) => attr.id === +key)
      if (attr) {
        const item: StandardProductCategoryAttrValue = {
          attrId: attr.id,
          attrName: attr.name,
          isExt: attr.valueType === VALUE_TYPE.INPUT ? 1 : 2,
          extension: '',
          valueId: 0
        }
        if (attr.valueType === VALUE_TYPE.INPUT) {
          item.extension = `${value}`
        } else {
          item.valueId = +value
        }
        result.push(item)
      }
    })
  return result
}

const convertSpInfoToServer = (product: MedicineAuditStandardProduct) => {
  const {
    category, tagList, pictureList, pictureDetailList,
    categoryAttrList, categoryAttrValueMap,
    ...others
  } = product

  const attrValueList = convertCategoryToServer(categoryAttrValueMap, categoryAttrList || [])
  if (product.spId) {
    _.forEach(attrValueList, attrValue => {
      attrValue.spSkuId = product.spId
    })
  }

  return {
    category: {
      id: category.id,
      categoryName: category.name,
      idPath: _.join(category.idPath, ','),
      namePath: _.join(category.namePath, ',')
    },
    medicineTagList: tagList,
    picList: pictureList,
    picDetailList: pictureDetailList,
    attrValueList,
    ..._.pick(others, ['name', 'upcList', 'spec', 'suggestedPrice'])
  }
}

/**
 * 药品审核灰度开关
 */
export const isAuditApplyEnabled = ({
  poiId
}: { poiId: string }) => httpClient.post('shangou/medicine/audit/r/spAuditGray', {
  wmPoiId: poiId
}).then((data = {}) => !!data.spAuditGray)

/**
 * 标品申请信息详情
 */
export const spAuditDetail = ({
  poiId,
  spId
}: {
  poiId: string | number,
  spId: number | string,
}) => httpClient.post('shangou/medicine/audit/r/detailAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0
})

// 新建/更新标品信息
export const saveOrUpdateSpInfo = ({
  poiId,
  spId,
  product
}: {
  poiId: string | number,
  spId: number | string,
  product: MedicineAuditStandardProduct,
}) => httpClient.post('shangou/medicine/audit/w/saveAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0,
  ...convertSpInfoToServer(product)
})

// 提交/重新提交标品申请
export const commitAuditSp = ({
  poiId,
  spId,
  product
}: {
  poiId: string | number,
  spId: number | string,
  product: MedicineAuditStandardProduct,
}) => httpClient.post('shangou/medicine/audit/w/commitAuditSp', {
  wmPoiId: poiId,
  spSkuId: spId || 0,
  ...convertSpInfoToServer(product)
})

// 取消审核申请
export const cancelAuditSp = ({
  spId
}: {
  spId: number | string,
}) => httpClient.post('shangou/medicine/audit/r/cancelAuditSp', {
  spSkuId: spId || 0
})
