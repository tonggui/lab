/**
 * @url reuse/mpc/product/r/getMerchantTypeInfo
 */
module.exports = function (req) {
  return {
    code: 0,
    message: 'fadsfdas',
    data: {
      merchantId: '@uuid',
      'merchantType|1': [0, 1, 2] // 0:未开通；1：商超；2：医药；
    }
  }
}
