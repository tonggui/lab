/**
 * @url /reuse/sc/product/retail/video/r/list
 */
module.exports = function(req) {
  const pageNum = +req.body.pageNum;
  const pageSize = +req.body.pageSize || 20;
  const totalNum = 100;
  const count = pageSize;
  return {
    msg: '',
    code: 0,
    data: {
      pageNum,
      pageSize,
      totalNum,
      usage: 234,
      [`wmProductVideoVoList|${count}`]: [
        {
          'id|+1': pageSize * (pageNum - 1) + 1,
          'length|+300': 10,
          title: '@name',
          main_pic_small_url: 'https://avatars1.githubusercontent.com/u/9376569?s=460&v=4',
          main_pic_large_url: 'https://avatars1.githubusercontent.com/u/9376569?s=460&v=4',
          'size|+50': 343,
          url_mp4: 'http://s3plus.meituan.net/v1/mss_959de39f2c304efda7e611d549f6b2b5/video/22F502DCF160930EE63433F43F6D9DE7.mp4',
          url_ogg: 'http://s3plus.meituan.net/v1/mss_959de39f2c304efda7e611d549f6b2b5/video/22F502DCF160930EE63433F43F6D9DE7.ogg',
          'status|1': [0, 0, 1, 1, 1, 2, 3, 3, 3],
          ctime: 1559216594894,
          utime: 1559216594894,
          'relSpuList|0-3': [
            {
              'id|+1': 1000,
              name: '@name',
              picture: 'https://avatars1.githubusercontent.com/u/9376569?s=460&v=4',
              upcCode: '123',
              wmProductSkus: [
                {
                  upcCode: '123',
                  price: 5,
                  stock: 10
                }
              ]
            }
          ],
        },
      ],
    },
  };
};
