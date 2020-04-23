/**
 * @url /reuse/sc/product/inspection/r/violationProcessing/productSnapshot
 */
module.exports = {
  msg: "没有获取到数据",
  "code|1": [0, 1],
  data: {
    poiName: "XX会所",
    poiTagPath: "生活超市>>便利店",
    spuId: 1234567890,
    productName: "大保健",
    productTagName: "生活用品",
    productTagDesc: "生活用品哈哈哈",
    productPicUrl: "http://p0.meituan.net/xianfu/c9cf73552463e3229c68121e1174388d63488.jpg",
    productDesc: "体验非常好",
    productSpec: "大份<br>中份<br>小份",
    productAttr: "【温度】 - 「常温」<br>【辣度】 - 「微辣」",
    productUnit: "次",
    violationProcessingLogs: [
      {
        violationReason: null,
        opMuname: "操作人",
        time: 1506520172,
        status: 1
      },{
        violationReason: "您的商品图片：“http://p1.meituan.net/xianfu/0feacb222ecf00b56d58ce6ed45e270f242465.jpg“，含有非有效商品信息，请您检查并在后续的商品管理中注意规避",
        opMuname: "操作人",
        time: 1506520172,
        status: 1
      }
    ]
  }
}
