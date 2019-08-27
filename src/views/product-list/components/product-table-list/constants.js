import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [{
  name: '上架',
  id: PRODUCT_BATCH_OP.PUT_ON
}, {
  name: '下架',
  id: PRODUCT_BATCH_OP.PUT_OFF
}, {
  name: '修改分类',
  id: PRODUCT_BATCH_OP.MOD_TAG
}, {
  name: '更多',
  id: 'more',
  children: [{
    name: '修改库存',
    id: PRODUCT_BATCH_OP.MOD_STOCK
  }, {
    name: '修改可售时间',
    id: PRODUCT_BATCH_OP.MOD_TIME
  }, {
    name: '修改商品标签',
    id: PRODUCT_BATCH_OP.MOD_LABEL
  }, {
    name: '删除',
    id: PRODUCT_BATCH_OP.DELETE
  }]
}]
