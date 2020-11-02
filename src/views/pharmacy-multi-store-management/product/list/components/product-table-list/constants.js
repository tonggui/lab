
import {
  BATCH_OPARATION_ENUM
} from '@/data/enums/multiStore'

export const batchOperation = [{
  name: '上架',
  type: BATCH_OPARATION_ENUM.PUT_ON,
  tip: {
    success: '批量上架成功～',
    error: '批量上架失败！'
  },
  statistics: {
    bid: 'b_shangou_online_e_5dph9qyi_mc',
    custom: {
      type: 1
    }
  }
}, {
  name: '下架',
  type: BATCH_OPARATION_ENUM.PUT_OFF,
  tip: {
    success: '批量下架成功～',
    error: '批量下架失败！'
  },
  statistics: {
    bid: 'b_shangou_online_e_b8nq8bph_mc',
    custom: {
      type: 2
    }
  }
}, {
  name: '删除',
  type: BATCH_OPARATION_ENUM.DELETE,
  tip: {
    success: '批量删除成功～',
    error: '批量删除失败！'
  },
  statistics: {
    bid: 'b_shangou_online_e_8off84xu_mc',
    custom: {
      type: 6
    }
  }
}, {
  name: '调价',
  type: BATCH_OPARATION_ENUM.MOD_PRICE,
  key: 'price',
  tip: {
    success: '批量调价成功～',
    error: '批量调价失败！'
  },
  statistics: {
    bid: 'b_shangou_online_e_u5dn9vvr_mc',
    custom: {
      type: 6
    }
  }
}, {
  name: '修改库存',
  type: BATCH_OPARATION_ENUM.MOD_STOCK,
  key: 'stock',
  tip: {
    success: '批量修改库存成功～',
    error: '批量修改库存失败！'
  },
  statistics: {
    bid: 'b_shangou_online_e_aiizj2b4_mc',
    custom: {
      type: 3
    }
  }
}]
