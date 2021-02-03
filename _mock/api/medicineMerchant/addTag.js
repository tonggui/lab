/**
 * @url /reuse/mpc/product/w/addTag
 */
module.exports = function (req) {
  return {
    code: 0,
    msg: '',
    data: req.tagId || 1
  }
}
