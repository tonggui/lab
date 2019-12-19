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
  UNSALABLE: 2201 // 滞销商品
}

const searchList = '/product/searchList'

export const PROBLEM_DETAIL = {
  [PROBLEM_TYPE.PRODUCT]: {
    id: 1000,
    title: '商品信息异常',
    count: 0,
    link: '',
    query: {},
    level: 0,
    children: [1100, 1200, 1300]
  },
  [PROBLEM_TYPE.PRICE_ALERT]: {
    id: 1100,
    title: '价格预警',
    count: 0,
    link: '',
    query: {},
    level: 1,
    children: [1101]
  },
  [PROBLEM_TYPE.PRICE_ANOMALY]: {
    id: 1101,
    title: '价格异常',
    count: 0,
    link: '/product/priceAnomaly',
    query: {},
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.PIC_ALERT]: {
    id: 1200,
    title: '图片预警',
    count: 0,
    link: '',
    query: {},
    level: 1,
    children: [1201, 1202, 1203]
  },
  [PROBLEM_TYPE.NO_PIC]: {
    id: 1201,
    title: '无图商品',
    count: 0,
    link: searchList,
    query: { curQueryType: 4 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.POOR_WHITE_RATE]: {
    id: 1202,
    title: '非白底图商品',
    count: 0,
    link: searchList,
    query: { curQueryType: 6 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.PIC_POOR]: {
    id: 1203,
    title: '图片质量差商品',
    count: 0,
    link: searchList,
    query: { curQueryType: 7 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.STOCK_ALERT]: {
    id: 1300,
    title: '库存预警',
    count: 0,
    link: '',
    query: {},
    level: 1,
    children: [1301, 1302]
  },
  [PROBLEM_TYPE.SOLD_OUT]: {
    id: 1301,
    title: '售罄商品',
    count: 0,
    link: searchList,
    query: { curQueryType: 3 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.STOCK_ANOMALY]: {
    id: 1302,
    title: '库存不足',
    count: 0,
    link: '/product/stockAnomaly',
    query: {},
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.OTHER]: {
    id: 2000,
    title: '其他问题',
    count: 0,
    link: '',
    query: {},
    level: 0,
    children: [2100, 2200]
  },
  [PROBLEM_TYPE.RULE_ALERT]: {
    id: 2100,
    title: '不合规商品预警',
    count: 0,
    link: '',
    query: {},
    level: 1,
    children: [2101, 2103]
  },
  [PROBLEM_TYPE.INCOMPLETE]: {
    id: 2101,
    title: '信息不全商品',
    count: 0,
    link: searchList,
    query: { curQueryType: 5 },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.ILLEGAL]: {
    id: 2103,
    title: '违规商品',
    count: 0,
    link: '/reuse/sc/product/inspection/r/falsePriceIndex',
    query: { wmPoiId: '' },
    level: 2,
    children: []
  },
  [PROBLEM_TYPE.SALE_ALERT]: {
    id: 2200,
    title: '30日店内滞销商品',
    count: 0,
    link: '',
    query: {},
    level: 1,
    children: [2201]
  },
  [PROBLEM_TYPE.UNSALABLE]: {
    id: 2201,
    title: '滞销商品',
    count: 0,
    link: '/product/unsalable',
    query: {},
    level: 2,
    children: []
  }
}
