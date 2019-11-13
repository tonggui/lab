/**
 * @url /reuse/sc/product/retail/r/listCategoryByParentId
 */
module.exports = function(req) {
  const parentId = +req.body.parentId;
  return {
    code: 0,
    msg: '',
    data: {
      parentId,
      'categoryList|2-10': [
        {
          'id|+1': parentId * 10 + 200002308,
          'idPath': '1,11,111',
          'name': '@name',
          'namePath': '@name,@name,@name',
          'level|1': [1, 2, 3],
          'isLeaf|1': [0, 1],
          parentId,
          // 'lockStatus|1': [0, 9101, 9102, 9103],
          'lockTips': '当前商品的售卖资质缺少资质名称1、资质名称2，请请前往门店资质处上传',
        }
      ]
    }
  };
}
