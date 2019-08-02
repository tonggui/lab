/**
 * @url /reuse/sc/product/retail/r/spBrandSug
 */
module.exports = function (req) {
  const keyword = req.body.keyword
  const count = Math.max(0, Math.ceil(Math.random() * 20) - 5)
  const id = Date.now()
  return {
    data: {
      keyword,
      [`list|${count}`]: [{
        brandSourceType: [0, 1],
        level: 1,
        ['brandId|+1']: id,
        ['spBrandId|+1']: id + 10000000,
        name: `${keyword}@cname`,
        namePath: '@name'
      }],
      message: ''
    },
    code: 0,
    msg: ''
  }
}
