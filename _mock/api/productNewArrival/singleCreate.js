/**
 * @url reuse/sc/product/shangou/cube/w/v2/saveProduct
 */
module.exports = function (req) {
  const productCubeSaveCommand = JSON.parse(req.body.productCubeSaveInfo)
  return {
    code: 0,
    msg: '',
    data: null
    // data: {
    //   code: 0, // 5102: "该商品被平台删除"
    //   message: '啦啦啦啦',
    //   failProduct: productCubeSaveCommand
    // }
  }
}
