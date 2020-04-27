/**
 * @url /reuse/sc/product/retail/r/getScHotSaleRootCategorys
 */
module.exports = function () {
  return {
    data: {
      'rootCategorys|2-10': [
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
