/**
 * @url reuse/sc/product/retail/r/getWhiteListByPoiIdAndType
 */
module.exports = function () {
  return {
    data: {
      whiteList: [
        {
          type: 6, // 分类智能排序
          status: 1,
        },
        {
          type: 7, // 图文详情
          status: 1,
        },
        {
          type: 8, // 商品视频
          status: 1,
        },
        {
          type: 9, // 店内多分类
          status: 0,
        },
      ],
    },
    code: 0,
    msg: ''
  };
};
