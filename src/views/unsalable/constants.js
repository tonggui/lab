/*
 * @description
 *   Please write the constants script's description
 * @author
 *   gl (guoli06@meituan.com)
 * @version
 *   1.0.0(2019/12/23)
 */
export const SOLUTIONS = {
  MARKETING: 220101,
  MANAGE_TAG: 220102,
  COMPLETE_PRODUCT_INFO: 220103,
  SORT_PRODUCT: 220104
}

const productList = '/product/list'

export const SOLUTIONS_DETAIL = [
  {
    id: 220101,
    title: '参与营销活动',
    content: '买赠，满减活动，折扣等营销活动，可以提升商品的吸引力。',
    link: '//waimaieapp.meituan.com/reuse/activity/setting/r/getPcIndexPage',
    linkText: '点击前往营销活动 >',
    bid: 'b_5v369qya'
  },
  {
    id: 220102,
    title: '调整店内分类',
    content: '将分类合并，同分类商品放在一起，做关联售卖。',
    link: productList,
    query: { wmPoiId: '' },
    linkText: '点击前往分类管理 >',
    bid: 'b_fvn4xvr5'
  },
  {
    id: 220103,
    title: '完善商品信息',
    content: '提高图片质量，优化商品信息，可以提升商品的吸引力，点击商品的“修改”按钮可以去优化。'
  },
  {
    id: 220104,
    title: '调整商品排序',
    content: '将商品排列在分类前面，将会优先曝光商品，但是会影响其他商品曝光，需要慎重操作。'
  }
]
