/**
 * @url /reuse/sc/product/inspection/r/violationProcessing/advanced/listProduct
 */
module.exports = {
  msg: "没有获取到数据",
  // "code|1": [0, 1],
  code: 0,
  data: {
    page: {
      // list: null,
      list: [{
        status: 1, // 1-已完成；2-已撤销； 3-已完成；
        processingMethod: 1, // 1-删除商品；2-替换敏感词；3-删除图片；
        processingTime: 1581308379830, // 时间戳，需要转为"2020.2.10 12:20"
        opMuname: "美团1",
        productPicUrl: "http://p1.meituan.net/wmproduct/6de00d293bf62e322b3ac4cd755a8f87709825.jpg",
        id: 1146768,
        violationType: "平台禁售商品1",
        violationContent: "商品图1",
        wmPoiId: 3600364,
        productName: "雅金香1",
        productTagName: "槟郎1",
        spuId: 671168623
      }, {
        status: 2,
        processingMethod: 2,
        processingTime: 1515638770,
        opMuname: "美团",
        productPicUrl: "http://p1.meituan.net/wmproduct/6de00d293bf62e322b3ac4cd755a8f87709825.jpg",
        id: 1146769,
        violationType: "平台禁售商品",
        violationContent: "商品图",
        wmPoiId: 3600364,
        productName: "雅金香",
        productTagName: "槟郎",
        spuId: 671168624
      }],
      pageNum: 1,
      pageSize: 20,
      totalSize: 1000,
    }
  }
}
