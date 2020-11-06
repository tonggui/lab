/**
 * @url reuse/sc/product/shangou/cube/2/w/batchSaveProduct
 */
module.exports = function (req) {
  const batchProductCubeSaveCommand = JSON.parse(req.body.productCubeSaveInfos)
  return {
    code: 0,
    msg: '',
    // data: batchProductCubeSaveCommand.slice(0, 1).map(p => ({
    //   code: 0,
    //   message: '啦啦啦啦',
    //   failProduct: p
    // }))
  }
}
