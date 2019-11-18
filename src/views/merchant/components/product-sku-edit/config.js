import { SKU_EDIT_TYPE } from '@/data/enums/product'

export const POI_SELECT_TYPE = {
  ALL_POI: 2,
  PART_POI: 1
}

export const defaultPoiType = POI_SELECT_TYPE.PART_POI

export const POI_SELECT_OPTIONS = [{
  value: POI_SELECT_TYPE.ALL_POI,
  label: '所有门店'
}, {
  value: POI_SELECT_TYPE.PART_POI,
  label: '指定门店'
}]

export default {
  [SKU_EDIT_TYPE.STOCK]: {
    confirmContent: '确认设置库存到所有门店',
    errorTip: '设置库存失败',
    successTip: '设置库存成功'
  },
  [SKU_EDIT_TYPE.PRICE]: {
    confirmContent: '确认设置价格到所有门店',
    errorTip: '设置价格失败',
    successTip: '设置价格成功'
  }
}

export const MODAL_TITLE = {
  [SKU_EDIT_TYPE.STOCK]: '设置库存',
  [SKU_EDIT_TYPE.PRICE]: '修改价格'
}
