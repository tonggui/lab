/**
 * @url /reuse/sc/product/retail/r/searchCategoryByName
 */
module.exports = function() {
  return {
    code: 0,
    msg: '',
    data: {
      'leafCategoryList|5-10': [{
        'categoryId|+1': [1,11,21,31,41,51,61,71,81,91],
        'idPath': '1,11,111',
        'categoryName': '@name',
        'categoryNamePath': '@name,@name,@name',
        'level|1': [1, 2, 3],
        'isLeaf|1': [0, 1],
      }]
    },
  };
}
