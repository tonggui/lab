import {
  PRODUCT_BATCH_OP,
  PRODUCT_SELL_STATUS
} from '@/data/enums/product'
import Stock from './components/stock'
import Tag from './components/tag'
import SellTime from './components/sellTime'
import Label from './components/label'

const config = {
  [PRODUCT_BATCH_OP.MOD_TAG]: {
    type: 'form',
    title: '批量修改商品分类',
    component: Tag
  },
  [PRODUCT_BATCH_OP.MOD_STOCK]: {
    type: 'form',
    title: '批量修改库存',
    component: Stock
  },
  [PRODUCT_BATCH_OP.MOD_TIME]: {
    type: 'form',
    title: '批量修改可售时间',
    component: SellTime
  },
  [PRODUCT_BATCH_OP.MOD_LABEL]: {
    type: 'form',
    title: '批量修改商品标签',
    component: Label
  },
  [PRODUCT_BATCH_OP.DELETE]: {
    type: 'confirm',
    title: '批量删除',
    confirm: ({ count }) => `删除商品后，已提交订单及加入购物车的商品将无法付款，本次将要删除 ${count} 个商品，请慎重操作`
  },
  [PRODUCT_BATCH_OP.PUT_ON]: {
    type: 'confirm',
    title: '批量上架',
    value: PRODUCT_SELL_STATUS.ON,
    confirm: ({ count }) => `共选择了 ${count} 件商品`
  },
  [PRODUCT_BATCH_OP.PUT_OFF]: {
    type: 'confirm',
    title: '批量下架',
    value: PRODUCT_SELL_STATUS.OFF,
    confirm: ({ count }) => `共选择了 ${count} 件商品，商品下架后可能导致已加入购物车的商品无法付款`
  }
}
export default config
