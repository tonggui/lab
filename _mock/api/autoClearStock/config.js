/**
 * @url reuse/sc/product/retail/r/stockConfig
 */
module.exports = {
  code: 0,
  data: {
    productStockConfig: {
      status: 1,
      ruleId: 111,
      type: [1],
      limitStop: {
        limitStopSyncStock: false,
        schedule: '12:00'
      },
      syncNextDay: {
        syncNextDayStock: true,
        syncCount: 10
      },
      isAll: false,
    },
    wmPoiIds: [632354, 664869, 711498],
    tagStats: [
      { tagId: 1, includes: [] },
      { tagId: 2, includes: [1, 2, 3] },
      { tagId: 3, includes: [1] }
    ]
  },
  msg: ''
}
