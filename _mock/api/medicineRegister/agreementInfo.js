/**
 * @url /health/pc/medicineSaleRule/getAgreementConfirmation
 */
module.exports = function() {
  return {
    code: 0,
    msg: '',
    data: {
      agreementUrl: "http://s3plus.vip.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/agreements/agreementV20180726/agreement_confirm.html?signed=1",
      signed: false,
      supermarketChain: true,
      signRequired: true
    }
  };
}
