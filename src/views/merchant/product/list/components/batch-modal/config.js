import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'
import Tag from './components/tag'
import Delete from './components/delete'

export const POI_SELECT_TYPE = {
  ALL_POI: 1,
  PART_POI: 2,
  MERCHANT: 3
}

export const defaultPoiType = POI_SELECT_TYPE.PART_POI

export const POI_SELECT_OPTIONS = [{
  value: POI_SELECT_TYPE.ALL_POI,
  label: '所有门店商品'
}, {
  value: POI_SELECT_TYPE.PART_POI,
  label: '指定门店商品'
}]

export const MERCHANT_OPTIONS = [{
  value: POI_SELECT_TYPE.MERCHANT,
  label: '总部商品'
}].concat(POI_SELECT_OPTIONS)

const config = {
  [PRODUCT_BATCH_OP.MOD_TAG]: {
    type: 'form',
    title: '批量修改商品分类',
    component: Tag,
    next: {
      [POI_SELECT_TYPE.ALL_POI]: '确认修改分类同步到所有分店'
    }
  },
  [PRODUCT_BATCH_OP.DELETE]: {
    type: 'form',
    title: '批量删除',
    tip: '删除商品后，已提交订单及加入购物车的商品将无法付款，请慎重操作',
    component: Delete,
    next: {
      [POI_SELECT_TYPE.MERCHANT]: '确认仅删除总部商品，分店商品不删除',
      [POI_SELECT_TYPE.ALL_POI]: '确认删除总部商品+所有关联的分店商品'
    }
  }
}
export default config
