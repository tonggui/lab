/**
 * @url /reuse/sc/product/retail/r/getSpCategoryListByPoi
 */
module.exports = function () {
  return {
    data: {
      'list|2-10': [
        {
          'id|+1': 1,
          'idPath': '1,11,111',
          'name': '@name',
          'namePath': '@name,@name,@name',
          'level|1': [1, 2, 3],
          'isLeaf|1': [0, 1],
          parentId: 0,
        }
      ]
    },
    code: 0,
    msg: ""
  };
};
