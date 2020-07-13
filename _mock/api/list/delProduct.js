/**
 * @url /reuse/sc/product/food/w/batchDelete
 */
module.exports = (req) => {
  const { packageConfirmFlag } = req.body
  if (!JSON.parse(packageConfirmFlag || 'false')) {
    return {
      msg: '所选商品删除后将同步所关联组包商品删除，确认是否全部删除？',
      code: 8302,
      data: null,
    }
  }
  return {
    code: 0,
  }
};
