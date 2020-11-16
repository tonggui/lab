
import {
  BATCH_OPARATION_ENUM
} from '@/data/enums/multiStore'

export const batchOperation = [{
  name: '上架',
  type: BATCH_OPARATION_ENUM.PUT_ON,
  tip: {
    // success: '批量上架成功～',
    success: '已提交，请查看任务进度～',
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
    // success: '批量下架成功～',
    success: '已提交，请查看任务进度～',
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
    // success: '批量删除成功～',
    success: '已提交，请查看任务进度～',
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
  packageTip: '组包商品价格根据组包内商品原价及组包优惠自动计算，不能直接修改。如需修改，您可以进入组包编辑页，调整组包内商品优惠幅度；或者，您在其他地方（如商家商品列表中）找到组包内关联的商品，修改相关商品的原价',
  tip: {
    // success: '批量调价成功～',
    success: '已提交，请查看任务进度～',
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
  packageTip: '组包商品库存根据组包内商品数量及商品库存自动计算，不能直接修改。如需修改，您可以找到组包内商品，修改关联商品的原库存',
  tip: {
    // success: '批量修改库存成功～',
    success: '已提交，请查看任务进度～',
    error: '批量修改库存失败！'
  },
  statistics: {
    bid: 'b_shangou_online_e_aiizj2b4_mc',
    custom: {
      type: 3
    }
  }
}]
