/*
 * @description
 *   Please write the constants script's description
 * @author
 *   gl (guoli06@meituan.com)
 * @version
 *   1.0.0(2019/6/4)
 */
export const MODAL_TYPE = {
  'SINGLE_RECOVER': {
    title: '恢复商品',
    okText: '确认',
    tipText: '确定要恢复该商品吗？',
    config: {
      'TAG': true,
      'TIP': true,
      'DATE': false
    }
  },
  'BATCH_RECOVER': {
    title: '批量恢复商品',
    okText: '确认',
    tipText: '确定要批量恢复这些商品吗？',
    config: {
      'TAG': true,
      'TIP': true,
      'DATE': false
    }
  },
  'CLEAN': {
    title: '清理回收站',
    okText: '确认清空',
    tipText: '',
    config: {
      'TAG': false,
      'TIP': false,
      'DATE': true
    }
  }
}
