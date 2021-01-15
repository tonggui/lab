/**
 * @url reuse/mpc/product/r/listRelPoi
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    "list|20": [{
      "poiId|+1": 1,
      name: "@cname",
      priceRange: "1.0",
      stock: 0,
      sellCount: "@integer(1, 100)",
      'sellStatus|1': [0, 1]
      // "priceRange": "@float(1, 100, 2, 2)",
      // stock: "@integer(1, 100)",
      // "sellStatus|1": [1, 0]
    }],
    totalCount: 1000,
    spu: {
      id: '@uuid',
      name: '@cname',
      upc: '@id',
      skuCode: '@id',
      "pic|1": ['', 'http://p0.meituan.net/scproduct/249d088af44bd87744fd7569c833eae3147107.jpg'],
      poiIds: [21, 22, 23]
    }
  }
}
