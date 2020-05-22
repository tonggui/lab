/**
 * @url reuse/sc/product/shangou/cube/r/searchRecProductsByCond
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    "productList|20": [{
      "id|+1": pageSize * (page - 1) + 1,
      name: "@ctitle(5, 30)",
      tagList: [{
        tagId: 1,
        tagName: '未分类'
      }],
      "isSp|+1": [1, 2],
      spId: "@uuid",
      "picture|1": ["http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
      "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
      "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
      "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg"],
      upcCode: '123',
      monthSale: 1000,
      sellStatus: 1,
      "skus|1-3": [{
        "skuAttrs|1": [null, [{
          value: '@ctitle(6, 10)',
          valueId: 0,
          valueIdPath: null,
          valuePath: null,
          sequence: 0,
          isCustomized: true,
          attrId: 300000029,
        }, {
          value: '@ctitle(6, 10)',
          valueId: 1,
          valueIdPath: null,
          valuePath: null,
          sequence: 0,
          isCustomized: true,
          attrId: 300000030,
        }]],
        minOrderCount: 1,
        "id|+1": pageSize * (page - 1) + 1,
        stock: 0,
        price: 0,
        upc: '@uuid',
        spec: '@ctitle(10, 30)',
        spuId: null,
        bizValue: null,
        weightUnit: '千克(kg)',
        boxPrice: 0,
        boxNum: 1,
        limitStock: 1,
        itemNum: '',
        shelfNum: '',
        skuCode: 'aaaaaaa',
        weight: 106,
        productName: null,
        unit: '份',
        sequence: 0
      }]
    }],
    totalCount: 100,
    page,
    pageSize
  }
}
