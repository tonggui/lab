/**
 * @url reuse/sc/product/retail/r/getWhiteListByPoiIdAndType
 */
module.exports = function () {
  return {
    data: {
      whiteList: [
        {
          type: 6,
          status: 1,
        },
        {
          type: 7,
          status: 1,
        },
        {
          type: 8,
          status: 0,
        },
        {
          type: 9,
          status: 0,
        },
      ],
    },
    code: 0,
    msg: ''
  };
};
