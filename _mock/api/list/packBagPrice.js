/**
 * @url /reuse/sc/product/packageprice/r/get
 */
module.exports = function () {
  return {
    code: 0,
    msg: '',
    data: {
      packagePayType: 1,
      packagePrice: 10,
      packagePriceRange: [{
        'value': 0,
        'label': '免费'
      }, {
        'value': 10,
        'label': '0.1元'
      }, {
        'value': 20,
        'label': '0.2元'
      }, {
        'value': 30,
        'label': '0.3元'
      }, {
        'value': 40,
        'label': '0.4元'
      }, {
        'value': 50,
        'label': '0.5元'
      }],
      wmPoiId: 6255650,
    }
  };
};
