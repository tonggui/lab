import _ from 'lodash'
import httpClient from '../client/instance/product'
import { MedicineAuditStandardProduct, AuditProductInfo } from '@/data/interface/product'
import {
  BaseCategory
} from '@/data/interface/category'
import {
  Pagination
} from '@/data/interface/common'
import { CategoryAttr, StandardProductCategoryAttrValue } from '@/data/interface/category'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  PRODUCT_AUDIT_STATUS
} from '@/data/enums/product'
import { VALUE_TYPE } from '@/data/enums/category'
import { trimSplitId, trimSplit } from '@/common/utils'

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
}) => httpClient.post('shangou/medicine/audit/w/cancelAuditSp', {
  spSkuId: spId || 0
})

export const submitDeleteSpAudit = ({ spId, poiId } : { spId: number, poiId: number }) => httpClient.post('shangou/medicine/audit/w/deleteAuditSp', {
  spSkuId: spId,
  wmPoiId: poiId
})

export const getAuditSpList = ({ poiId, pagination, searchWord, auditStatus } : {
  poiId: number,
  pagination: Pagination,
  searchWord: string,
  auditStatus: PRODUCT_AUDIT_STATUS[]
}) => httpClient.post('shangou/medicine/audit/r/listAuditSp', {
  wmPoiId: poiId,
  auditStatus,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  searchWord: searchWord || ''
}).then(data => {
  const { totalCount, list = [] } = (data || {}) as any
  return {
    pagination: {
      ...pagination,
      total: totalCount || 0
    },
    list: (list || []).map(product => {
      const { id, idPath, namePath, categoryName } = (product.category || {}) as any
      const category: BaseCategory = {
        id,
        idPath: trimSplitId(idPath),
        name: categoryName,
        namePath: trimSplit(namePath)
      }
      const node: AuditProductInfo = {
        id: product.spSkuId,
        name: product.name,
        pictureList: product.picList,
        upcCode: product.upcList ? product.upcList[0] : '',
        auditStatus: product.auditStatus,
        category,
        ctime: product.ctime || undefined
      }
      return node
    })
  }
})

export const getAuditSpSearchSuggestion = ({ poiId, keyword }: { poiId: number, keyword: string }) => httpClient.get('shangou/medicine/audit/r/sugAuditSp', {
  keyword,
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})
