/**
 * @url /reuse/sc/product/hqcc/w/saveTag
 */
module.exports = function (req) {
  return {
    code: 0,
    msg: '',
    data: req.tagId || 1
  }
}
