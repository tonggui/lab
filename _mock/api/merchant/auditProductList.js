/**
 * @url /reuse/sc/product/hqcc/audit/r/List
 */
// module.exports = {
  // code: 0,
  // message: '',
  // data: {
  //   totalCount: 100,
  //   "productList|20": [{
  //     name: '@ctitle(5, 30)',
  //     "id": "@uuid",
  //     categoryId: 123,
  //     categoryName: '商品类目',
  //     categoryIdPath: '123,123',
  //     categoryNamePath: '商品类目1,商品类目2',
  //     "upcCode": "@uuid",
  //     picture: [
  //       "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
  //       "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
  //       "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
  //       "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg"
  //     ],
  //     "auditStatus|1": [1, 2, 3, 5],
  //     ctime: 1586514029640,
  //     "auditUpdateData|1": [true, false],
  //     "createTime": 1559216594894,
  //     "auditUpdateTime": 1559216594894,
  //     "saveOrUpdate|1": [1]
  //   }]
  // }
// }

module.exports = {
  message: 'SUCCESS',
  data: {
    totalCount: 2,
    productList: [
      {
        auditCreateTime: 1596532737335,
        auditUpdateTime: 1596532737335,
        saveOrUpdate: 1,
        auditUpdateData: false,
        name: '按摩椅',
        id: 155967,
        categoryId: 900000158,
        categoryName: '矿泉水',
        picture: 'http://p1.meituan.net/xianfu/c5aab20310593e687f9f4e9bd7592832241246.jpg',
        upcCode: '33333333',
        auditStatus: 0,
        categoryNamePath: '酒饮冲调,饮用水,矿泉水'
      },
      {
        auditCreateTime: 1596512161175,
        auditUpdateTime: 1596512161175,
        saveOrUpdate: 1,
        auditUpdateData: false,
        name: '送审验证01',
        id: 155946,
        categoryId: 900000158,
        categoryName: '矿泉水',
        picture: 'http://p0.meituan.net/scproduct/1dc62bda671e3194fb00fa37b065096986502.jpg',
        upcCode: '6936357400894',
        auditStatus: 0,
        categoryNamePath: '酒饮冲调,饮用水,矿泉水'
      }
    ]
  },
  code: 0
}
