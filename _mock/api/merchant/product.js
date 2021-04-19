/**
 * @url /reuse/sc/product/hqcc/r/listProduct
 */

module.exports = function (req, mock, random) {
  const { pageNum, pageSize } = req.body;
  return {
    code: 0,
    msg: '',
    data: {
      "products|20": [{
        "spuId|+1": 1,
        'sellStatus|1': [0, 1],
        "name|1": [
          "酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
          "可口可乐"
        ],
        priceRange: '0-100',
        poiCount: '100',
        "missingRequiredInfo|1": [true, false],
        pictures: () => {
          return random.shuffle([
            "",
            "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
            "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
            "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
            "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg"
          ]);
        },
        ctime: '2019-11-12',
        sequence: (pageNum - 1) * pageSize + 1000,
        merchantDelStatus: 1,
        "skuVoList|1-4": [
          {
            "id|+1": 0,
            upc: "123",
            'price|1': [12345.12, 10],
            'weight|1': [12345.12, 10],
            'weightUnit': '克',
            'shelfNum': 123,
            stock: 0,
            "spec|1": ["450ml", "150ml", "300ml"]
          }
        ],
        tagList:[
          {
            id: 626,
            name: "分类",
            sequence: 0,
            parentId: 1000242
          }
        ]
      }],
      // "products": [{
      //   "spuId": 1,
      //   'sellStatus': 1,
      //   "name": "酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
      //   priceRange: '0-100',
      //   poiCount: '100',
      //   pictures: [
      //     "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
      //     "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
      //     "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
      //     "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg"
      //   ],
      //   ctime: '2019-11-12'
      //   // sequence: (pageNum - 1) * pageSize + 1000
      // }, {
      //   "spuId": 2,
      //   'sellStatus': 1,
      //   "name": "可靠咳咳咳",
      //   priceRange: '0-100',
      //   poiCount: '100',
      //   pictures: [
      //     "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
      //     "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
      //     "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
      //     "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg"
      //   ],
      //   ctime: '2019-11-12'
      // }],
      pageNum,
      pageSize,
      'totalCount': 1000,
      'missingRequiredCount|1': [0, 3, 5, 25],
      "tags|20": [{
        name: '@cname',
        "id|+1": 1000001,
        productCount: 10,
        "topFlag|1": [0, 1],
        timeZoneForHuman: '每周一日<br />14:12-14:14',
        topTimeZone: {
          '1': [
            {end: "14:14", time: "14:12-14:14", start: "14:12"},
          ],
          '7': [
            {end: "14:14", time: "14:12-14:14", start: "14:12"},
          ]
        },
        "subTags|0-5": [{
          name: '@cname',
          "id|+1": 1,
          productCount: 10,
          isLeaf: 1
        }]
      }]
    }
  }
}
