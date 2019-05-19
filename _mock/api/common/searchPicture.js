/**
 * @url /reuse/sc/product/food/r/selectPicture
 */
module.exports = function (req) {
  return {
    data: {
      pps: {
        lastNum: 1,
        nextNum: 2,
        total: 332,
        list: [
          'http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg',
          'http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg',
          'http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg',
          'http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg',
          'http://p0.meituan.net/xianfu/17f4b1e95942f5960964110a774776a2118778.jpg',
          'http://p0.meituan.net/xianfu/7236317a3d495879335a36e496b2a53e176565.jpg',
          'http://p0.meituan.net/xianfu/5b16a9022fdf82f71c49d62a823b3ab4164926.jpg',
          'http://p0.meituan.net/xianfu/0dab19a87b9cfcaad701f30daf0298f5215040.jpg',
          'http://p0.meituan.net/xianfu/7fd4a2b40edeafbe186a2929811ec59c118784.jpg',
          'http://p0.meituan.net/xianfu/050cdc2ca37fc0e0abe4c4e62c599b4524547.jpg',
          'http://p0.meituan.net/xianfu/38a1ac8c4c09d6e378bd5c2f45fde1b1292864.jpg',
          'http://p0.meituan.net/xianfu/559b3317630cdd38203756d6cc6a822239978.jpg'
        ],
        pageSize: 12,
        pageNum: 1,
        totalNum: 28
      },
      code: 0,
      pageNum: 1,
      picList: [
        'http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg',
        'http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg',
        'http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg',
        'http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg',
        'http://p0.meituan.net/xianfu/17f4b1e95942f5960964110a774776a2118778.jpg',
        'http://p0.meituan.net/xianfu/7236317a3d495879335a36e496b2a53e176565.jpg',
        'http://p0.meituan.net/xianfu/5b16a9022fdf82f71c49d62a823b3ab4164926.jpg',
        'http://p0.meituan.net/xianfu/0dab19a87b9cfcaad701f30daf0298f5215040.jpg',
        'http://p0.meituan.net/xianfu/7fd4a2b40edeafbe186a2929811ec59c118784.jpg',
        'http://p0.meituan.net/xianfu/050cdc2ca37fc0e0abe4c4e62c599b4524547.jpg',
        'http://p0.meituan.net/xianfu/38a1ac8c4c09d6e378bd5c2f45fde1b1292864.jpg',
        'http://p0.meituan.net/xianfu/559b3317630cdd38203756d6cc6a822239978.jpg'
      ]
    },
    code: 0,
    msg: '获取图库菜品图片成功'
  };
};
