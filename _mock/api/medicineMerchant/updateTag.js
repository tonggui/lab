/**
 * @url /reuse/mpc/product/w/updateTag
 */
module.exports = function (req) {
  return {
    code: 0,
    msg: '',
    data: req.tagId || 1
  }
}