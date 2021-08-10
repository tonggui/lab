/*
 * @description
 *   Please write the constants script's description
 * @author
 *   gl (guoli06@meituan.com)
 * @version
 *   1.0.0(2019/12/19)
 */
export const PROBLEM_TYPE = {
  PRODUCT: 1000, // 商品信息异常
  PRICE_ALERT: 1100, // 价格预警
  PRICE_ANOMALY: 1101, // 价格异常
  PIC_ALERT: 1200, // 图片预警
  NO_PIC: 1201, // 无图商品
  POOR_WHITE_RATE: 1202, // 非白底图商品
  PIC_POOR: 1203, // 图片质量差商品
  STOCK_ALERT: 1300, // 库存预警
  SOLD_OUT: 1301, // 售罄商品
  STOCK_ANOMALY: 1302, // 库存不足
  OTHER: 2000, // 其他问题
  RULE_ALERT: 2100, // 不合规商品预警
  INCOMPLETE: 2101, // 信息不全商品
  // UMCOMPLIANCE: 2102, // 信息不规范商品 aka 算法
  ILLEGAL: 2103, // 违规商品
  SALE_ALERT: 2200, // 30日店内滞销商品
  UNSALABLE: 2201, // 滞销商品
  CATEGORY_ALERT: 2300, // 商品类目问题
  ERROR_CATEGORY: 2301, // 类目与商品不匹配
  EMPTY_CATEGORY: 2302, // 未填写类目
  OUT_OF_SCOPE: 2400, // 超范围经营
  OUT_RANGE: 2401, // 超出经营范围
  NO_QUALIFICATION: 2402 // 缺少资质商品
}

const searchList = '/product/searchList'

export const PROBLEM_DETAIL = {
  [PROBLEM_TYPE.PRODUCT]: {
    id: 1000,
    bid: '',
    title: '商品信息异常',
    count: ['priceAnomaly', 'noPic', 'poorWhiteRate', 'poorQuality', 'soldOut', 'stockAnomaly'],
    extra: '',
    link: '',
    query: {},
    level: 0,
    children: [1100, 1200, 1300]
  },
  [PROBLEM_TYPE.PRICE_ALERT]: {
    id: 1100,
    bid: '',
    title: '价格预警',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [1101]
  },
  [PROBLEM_TYPE.PRICE_ANOMALY]: {
    id: 1101,
    bid: 'b_shangou_online_e_ummk8eqq_mc',
    title: '价格异常',
    count: 'priceAnomaly',
    extra: '',
    link: '/product/priceAnomaly',
    query: {},
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.PIC_ALERT]: {
    id: 1200,
    bid: '',
    title: '图片预警',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [1201, 1202, 1203]
  },
  [PROBLEM_TYPE.NO_PIC]: {
    id: 1201,
    bid: 'b_shangou_online_e_a0q1vjwt_mc',
    title: '无图商品',
    count: 'noPic',
    extra: '',
    link: searchList,
    query: { curQueryType: 4 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.POOR_WHITE_RATE]: {
    id: 1202,
    bid: 'b_shangou_online_e_4rsqc34p_mc',
    title: '非白底图商品',
    count: 'poorWhiteRate',
    extra: '（内测）',
    link: searchList,
    query: { curQueryType: 6 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.PIC_POOR]: {
    id: 1203,
    bid: 'b_shangou_online_e_aumcjkn7_mc',
    title: '图片质量差商品',
    count: 'poorQuality',
    extra: '（内测）',
    link: searchList,
    query: { curQueryType: 7 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.STOCK_ALERT]: {
    id: 1300,
    bid: '',
    title: '库存预警',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [1301, 1302]
  },
  [PROBLEM_TYPE.SOLD_OUT]: {
    id: 1301,
    bid: 'b_shangou_online_e_qzxw28hg_mc',
    title: '售罄商品',
    count: 'soldOut',
    extra: '',
    link: searchList,
    query: { curQueryType: 3 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.STOCK_ANOMALY]: {
    id: 1302,
    bid: 'b_shangou_online_e_3wle1mww_mc',
    title: '库存不足',
    count: 'stockAnomaly',
    extra: '',
    link: '/product/stockAnomaly',
    query: {},
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.OTHER]: {
    id: 2000,
    bid: '',
    title: '其他问题',
    count: ['incomplete', 'illegal', 'unsalable', 'errorCategory', 'emptyCategory', 'outRange', 'noQualification'],
    extra: '',
    link: '',
    query: {},
    level: 0,
    children: [2100, 2200, 2300, 2400]
  },
  [PROBLEM_TYPE.RULE_ALERT]: {
    id: 2100,
    bid: '',
    title: '不合规商品预警',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [2101, 2103]
  },
  [PROBLEM_TYPE.INCOMPLETE]: {
    id: 2101,
    bid: 'b_shangou_online_e_weo3a45p_mc',
    title: '信息不全商品',
    count: 'incomplete',
    extra: '',
    link: searchList,
    query: { curQueryType: 5 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.ILLEGAL]: {
    id: 2103,
    bid: 'b_shangou_online_e_b8c22qds_mc',
    title: '违规商品',
    count: 'illegal',
    extra: '',
    link: '/product/violationInfo',
    query: { wmPoiId: '' },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.SALE_ALERT]: {
    id: 2200,
    bid: '',
    title: '30日店内滞销商品',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [2201]
  },
  [PROBLEM_TYPE.UNSALABLE]: {
    id: 2201,
    bid: 'b_shangou_online_e_f03k4fvt_mc',
    title: '滞销商品',
    count: 'unsalable',
    extra: '',
    link: '/product/unsalable',
    query: {},
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.CATEGORY_ALERT]: {
    id: 2300,
    bid: '',
    title: '商品类目问题',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [2301, 2302]
  },
  [PROBLEM_TYPE.ERROR_CATEGORY]: {
    id: 2301,
    bid: 'b_shangou_online_e_vu7c771b_mc',
    title: '类目与商品不匹配',
    count: 'errorCategory',
    extra: '',
    link: searchList,
    query: { curQueryType: 9 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.EMPTY_CATEGORY]: {
    id: 2302,
    bid: 'b_shangou_online_e_791hnl0w_mc',
    title: '未填写类目',
    count: 'emptyCategory',
    extra: '',
    link: searchList,
    query: { curQueryType: 8 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.OUT_OF_SCOPE]: {
    id: 2400,
    bid: '',
    title: '超范围经营',
    count: 0,
    extra: '',
    link: '',
    query: {},
    level: 1,
    children: [2401, 2402]
  },
  [PROBLEM_TYPE.OUT_RANGE]: {
    id: 2401,
    bid: '',
    title: '超出经营范围',
    count: 'outRange',
    extra: '（请正确填写商品信息）',
    link: searchList,
    query: { curQueryType: 10 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.NO_QUALIFICATION]: {
    id: 2402,
    bid: '',
    title: '缺少资质商品',
    count: 'noQualification',
    extra: '（上传资质）',
    link: searchList,
    query: { curQueryType: 11 },
    level: 2,
    children: []
  }
}