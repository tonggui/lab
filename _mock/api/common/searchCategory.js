/**
 * @url /reuse/sc/product/retail/r/searchCategoryByName
 */
module.exports = function() {
  return {
    code: 0,
    msg: '',
    data: {
      'leafCategoryList|5-10': [{
        'categoryId|+1': [1,11,21,31,41,51,61,71,81,91,200002308],
        'idPath': '200002308,11,111',
        'categoryName': '@name',
        'categoryNamePath': '@name,@name,@name',
        'level|1': [1, 2, 3],
        'isLeaf|1': [0, 1],
        'lockStatus|1': [0, 9101, 9102, 9103],
        'allowCustomProduct|1': [true, false],
        'lockTips': '当前商品的售卖资质缺少资质名称1、资质名称2，请请前往门店资质处上传',
      }]
    },
  };
}
