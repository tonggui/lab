import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [{
  name: '上架',
  id: PRODUCT_BATCH_OP.PUT_ON,
  tip: {
    success: '批量上架成功～',
    error: '批量上架失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 1
    }
  }
}, {
  name: '下架',
  id: PRODUCT_BATCH_OP.PUT_OFF,
  tip: {
    success: '批量下架成功～',
    error: '批量下架失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 2
    }
  }
}, {
  name: '修改分类',
  id: PRODUCT_BATCH_OP.MOD_TAG,
  tip: {
    success: '批量修改分类成功～',
    error: '批量修改分类失败！'
  },
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
    tip: {
      success: '批量修改库存成功～',
      error: '批量修改库存失败！'
    },
    statistics: {
      bid: 'b_ripg0ips',
      custom: {
        type: 3
      }
    }
  }, {
    name: '修改可售时间',
    id: PRODUCT_BATCH_OP.MOD_TIME,
    tip: {
      success: '批量修改可售时间成功～',
      error: '批量修改可售时间失败！'
    },
    statistics: {
      bid: 'b_ripg0ips',
      custom: {
        type: 9
      }
    }
  }, {
    name: '修改商品标签',
    id: PRODUCT_BATCH_OP.MOD_LABEL,
    tip: {
      success: '批量修改商品标签成功～',
      error: '批量修改商品标签失败！'
    },
    statistics: {
      bid: 'b_shangou_online_e_f8v92hvu_mc'
    }
  }, {
    name: '删除',
    id: PRODUCT_BATCH_OP.DELETE,
    tip: {
      success: '批量删除成功～',
      error: '批量删除失败！'
    },
    statistics: {
      bid: 'b_ripg0ips',
      custom: {
        type: 6
      }
    }
  }]
}]

export const getTip = (map, params) => {
  const key = Object.keys(map).find((key) => key in params)
  return map[key] || ''
}

export const getEditTip = (params) => {
  const map = {
    name: '名称',
    pictureList: '图片'
  }
  const op = getTip(map, params)
  return {
    success: `修改商品${op}成功～`,
    error: `操作商品${op}失败！`
  }
}

export const getEditSkuTip = (params) => {
  const map = {
    price: '价格',
    stock: '库存'
  }
  const op = getTip(map, params)
  return {
    success: `修改商品${op}成功～`,
    error: `操作商品${op}失败！`
  }
}
