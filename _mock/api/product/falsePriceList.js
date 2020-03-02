/**
 * @url /reuse/sc/product/inspection/r/getFalsePriceListByWmPoi
 */
module.exports = {
  msg: "没有获取到数据",
  "code": 1,
  // "code|1": [0, 1],
  data: {
    pageNum: 1,
    pageSize: 30,
    violationTotalCount: 50, // 信息违规商品总数
    falsePriceTotalCount: 3333, // 原价虚高商品总数
    update_time: '2020-02-20',
    isfalsePriceModifyAllowed: 0,
    falsePriceModifyAllowedTimeRange: {
      mondayBeginTime: '23:00',
      fridayEndTime: '23:00'
    },
    falsePriceModifyHint: "请在1月1日14:30 - 1月5日18:00调整完毕，否则商品会被下架，如有疑问请联系业务经理",
    productFalsePrices: {
      not_correct_count: 10,
      correct_count: 12,
      totalNum: 773,
      false_price_list: null
      /*
      false_price_list: [{
        sku_id: 12345,
        sku_name: "宫保鸡丁",
        tag_name: "套餐",
        picture_url: "http://p0.meituan.net/shangchao/6dfc564764de427f99bf7bc478a17baa.jpg@88h_88w_1e",
        origin_price: 10,
        suggest_price: 5,
        current_price: 8,
        correct_status: 0,
        spec: ''
      }, {
        sku_id: 12345,
        sku_name: "宫保鸡丁",
        tag_name: "套餐",
        picture_url: "",
        origin_price: 10,
        suggest_price: 5,
        current_price: 8,
        correct_status: 0,
        spec: ''
      }]
      */
    }
  }
}
