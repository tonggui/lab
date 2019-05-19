/**
 * @url reuse/sc/product/shangou/r/attrValueCascade
 */
module.exports = function(req) {
  const parentId = +req.query.parentId;
  return {
    code: 0,
    msg: '',
    data: {
      totalCount: 20,
      "categoryAttrValueVos|10": [{
        'valueId|+1': parentId * 10 + 1,
        value: '@cname',
        valueIdPath: '1,11',
        valuePath: '@cname,@cname,@cname',
        'isLeaf|1': [0, 1],
      }]
    }
  }
};
