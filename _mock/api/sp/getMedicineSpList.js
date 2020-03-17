/**
 * @url /reuse/sc/product/shangou/sp/r/searchSpListByCond
 */
module.exports = function(req) {
  const name = req.body.name;
  const pageNum = +req.body.pageNum;
  const pageSize = +req.body.pageSize;
  const total = name ? (name === 'none' ? 0 : 30) : 50;
  const totalNum = Math.ceil(total / pageSize);
  const count = name === 'none' ? 0 : 20;
  return {
    msg: '',
    code: 0,
    data: {
      pageNum,
      pageSize,
      total,
      totalNum,
      [`list|${count}`]: [
        {
          'id|+1': 2,
          'name': '@name',
          'isOtc|1': [1, 2, 3],
          'permissionNumber|1': ['123456白加黑白加黑白1231231231231231231223131231232113123123123123123', '123456'],
          'canChoose|+1': [1, 2],
          'lockStatus|+1': [0, 0, 0, 0, 0, 9101, 9102, 9103],
          'lockTips|+1': ['fdsfdsfdsfsdfdsfds', '当前商品的售卖资质缺少资质名称1、资质名称2，请请前往门店资质处上传'],
          'upcCode|+1': 11111111,
          'specification': '1.25L',
          'currentPrice': 11,
          'originPrice': 11,
          'manufaturer': '美团点评',
          'isSale|1': [1, 2],
          'pictureList': ['http://p0.meituan.net/shangchao/6dfc564764de427f99bf7bc478a17baa.jpg@88h_88w_1e', 'http://p0.meituan.net/shangchao/6dfc564764de427f99bf7bc478a17baa.jpg@88h_88w_1e'],
          'categoryList': ['医学器材','儿童用药']
        }
      ],
    },
  };
};
