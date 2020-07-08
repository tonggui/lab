/**
 * @url /reuse/sc/product/shangou/package/r/detailProduct
 */
module.exports = function (req, mock, random) {
  const { wmPoiId, spuId } = req.body;
  return {
    code: 0,
    msg: '',
    data: {
      id: +spuId,
      wmPoiId: +wmPoiId,
      "skuId": "@integer(0, 987675321)",
      "name": "@cname",
      "suitableScene": "@cname",
      "combinationSpus|1-4": [{
        "id": "@integer",
        "spuId": "@integer",
        "name": "@cname",
        "spec": "@cname",
        category: {
          idPath: ',200000062,200000087,200000088,',
          categoryNamePath: '制品,冰品,袋装冰激凌',
          isLeaf: 1,
          categoryId: 200000088,
          parentId: 200000087,
          categoryName: '袋装冰激凌',
          level: 3
        },
        "upc": "@integer(12999999, 123892318903)",
        "stock": "@integer(-1, 999)",
        "price": "@float(0, 30000, 0, 2)",
        "discount": "@float(0, 10, 0, 2)",
        "count": "@integer(1, 99)",
        "sellStatus|1": [1, 2, 0],
      }],
      description: "商品描述",
      picture: "商品描述",
      category: {
        idPath: ',200000062,200000087,200000088,',
        categoryNamePath: '制品,冰品,袋装冰激凌',
        isLeaf: 1,
        categoryId: 200000088,
        parentId: 200000087,
        categoryName: '袋装冰激凌',
        level: 3
      },
      tagList: [
        {
          tagName: '测试分类2',
          tagId: 3,
          parentName: '403一级分类',
        }
      ],
      stock: 0,
      price: 0,
      picture: 'http://p1.meituan.net/shangchao/3fb8bbf316164ef295ef0222c777a3a9.jpg,,,,',
      picContent: "http://p0.meituan.net/scproduct/9187625ab832e8cfdb74755826ddae09280843.jpg?w=1709&h=960,http://p0.meituan.net/scproduct/d8405b2203ada027b1ff0ad2f78a4a6a370718.jpg?w=1709&h=960,http://p0.meituan.net/scproduct/c49ce6f332fea63cd92fef0889bad3e888259.jpg?w=1125&h=1125,http://p0.meituan.net/scproduct/9969aa40d7e6f15828dfed0b39a60bf2226215.jpg?w=2048&h=2048",
      labels: [{subAttr: "0", id: 1, groupId: 1, groupName: "招牌"}],
      shippingTimeX: '[[],["11:21-11:24"],["11:21-11:24"],[],["11:21-11:24"],[],[]]',
      poorImages: [1],
      limitSale: JSON.stringify({
        limitSale: true,
        begin: '20200301',
        end: '20200401',
        type: 2,
        count: 100
      }),
    },
  }
}
