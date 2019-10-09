import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [{
  name: '上架',
  id: PRODUCT_BATCH_OP.PUT_ON,
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 1
    }
  }
}, {
  name: '下架',
  id: PRODUCT_BATCH_OP.PUT_OFF,
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 2
    }
  }
}, {
  name: '修改分类',
  id: PRODUCT_BATCH_OP.MOD_TAG,
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 4
    }
  }
}, {
  name: '更多',
  id: 'more',
  children: [{
    name: '修改库存',
    id: PRODUCT_BATCH_OP.MOD_STOCK,
    statistics: {
      bid: 'b_ripg0ips',
      custom: {
        type: 3
      }
    }
  }, {
    name: '修改可售时间',
    id: PRODUCT_BATCH_OP.MOD_TIME,
    statistics: {
      bid: 'b_ripg0ips',
      custom: {
        type: 9
      }
    }
  }, {
    name: '修改商品标签',
    id: PRODUCT_BATCH_OP.MOD_LABEL,
    statistics: {
      bid: 'b_shangou_online_e_f8v92hvu_mc'
    }
  }, {
    name: '删除',
    id: PRODUCT_BATCH_OP.DELETE,
    statistics: {
      bid: 'b_ripg0ips',
      custom: {
        type: 6
      }
    }
  }]
}]
