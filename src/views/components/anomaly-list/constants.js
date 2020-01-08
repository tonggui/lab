/*
 * @description
 *   Please write the constants script's description
 * @author
 *   gl (guoli06@meituan.com)
 * @version
 *   1.0.0(2019/12/24)
 */
export const MODAL_TYPE = {
  CHECK: 0,
  DB_CHECK: 1
}

export const PRICE_ANOMALY_MODAL = {
  [MODAL_TYPE.CHECK]: {
    title: '核对价格',
    content: '已核对商品与价格，确认价格正确吗？',
    'ok-text': '价格正确',
    'cancel-text': '取消'
  },
  [MODAL_TYPE.DB_CHECK]: {
    title: '商家价格异常',
    content: (price, title, spec) => `当前商品价格${price}元，商品标题：${title}，商品规格：${spec}`,
    'ok-text': '确认发布',
    'cancel-text': '点错了'
  }
}
