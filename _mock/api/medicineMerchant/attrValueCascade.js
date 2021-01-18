/**
 * @url reuse/mpc/product/r/attrValueCascade
 */
module.exports = function(req) {
  const parentId = +req.body.parentId;
  return {
    code: 0,
    msg: '',
    data: {
      totalCount: 20,
      "categoryAttrValueVos|10": [{
        'valueId|+1': parentId * 10 + 1,
        value: '@name',
        valueIdPath: '1,11',
        valuePath: '@cname,@cname,@cname',
        'isLeaf|1': [0, 1],
      }]
    }
  }
};
