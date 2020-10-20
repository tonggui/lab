export const batchOperation = [{
  name: '上架',
  type: 'PUT_ON',
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
  type: 'PUT_OFF',
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
  name: '删除',
  type: 'DELETE',
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
}, {
  name: '调价',
  type: 'MOD_PRICE',
  tip: {
    success: '批量调价成功～',
    error: '批量调价失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 6
    }
  }
}, {
  name: '修改库存',
  type: 'MOD_STOCK',
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
}]
