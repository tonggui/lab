/**
 * @url reuse/sc/product/shangou/cube/w/saveProducts
 */
module.exports = function (req) {
  const productCubeSaveCommand = JSON.parse(req.body.productCubeSaveCommand)
  return {
    code: 0,
    msg: '',
    data: {
      code: 0, // 5102: "该商品被平台删除"
      message: '啦啦啦啦',
      failProduct: productCubeSaveCommand
    }
  }
}