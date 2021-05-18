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
        "limitRuleId|1": [0,1,2,3,0,0,0,0],
        "spuId|+1": 1,
        'sellStatus|1': [0, 1],
        "name|1": [
          "酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
          "可口可乐2"
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

// module.exports = {
//   data: {
//     pageNum: 1,
//     pageSize: 20,
//     totalCount: 333,
//     products: [
//       {
//         appFoodCode: null,
//         limitRuleId: null,
//         priceRange: "11.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: null,
//             itemNum: null,
//             id: 426204,
//             sequence: 1,
//             minOrderCount: 1,
//             unit: "份",
//             stock: 111,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 11.0,
//             boxPrice: 0.0,
//             boxNum: 1,
//             weightUnit: "克(g)",
//             upc: "",
//             skuCode: "",
//             skuAttrs: null,
//             spec: "",
//             weight: -1.0
//           }
//         ],
//         poiCount: 3,
//         name: "今麦郎-同步1",
//         sellStatus: 0,
//         merchantDelStatus: 2,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416711,
//         upc: null,
//         skuCode: null,
//         pictures: [
//           "http://p0.meituan.net/scproduct/52669e7392093e876ef1f72e4229113527694.jpg"
//         ],
//         poiIds: null,
//         missingRequiredInfo: false
//       },
//       {
//         appFoodCode: null,
//         limitRuleId: null,
//         priceRange: "10.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: null,
//             itemNum: null,
//             id: 426207,
//             sequence: -1,
//             minOrderCount: 1,
//             unit: "份",
//             stock: -1,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 10.0,
//             boxPrice: 1.0,
//             boxNum: 2,
//             weightUnit: "",
//             upc: "",
//             skuCode: "food_jyf_test99",
//             skuAttrs: null,
//             spec: "",
//             weight: -1.0
//           }
//         ],
//         poiCount: 2,
//         name: "jyf的水果99",
//         sellStatus: 0,
//         merchantDelStatus: 2,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416714,
//         upc: null,
//         skuCode: null,
//         pictures: [""],
//         poiIds: null,
//         missingRequiredInfo: false
//       },
//       {
//         appFoodCode: null,
//         limitRuleId: null,
//         priceRange: "1.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: null,
//             itemNum: null,
//             id: 426208,
//             sequence: 1,
//             minOrderCount: 1,
//             unit: "份",
//             stock: 1,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 1.0,
//             boxPrice: 0.0,
//             boxNum: 0,
//             weightUnit: "克(g)",
//             upc: "",
//             skuCode: "",
//             skuAttrs: null,
//             spec: "A",
//             weight: 1.0
//           }
//         ],
//         poiCount: 5,
//         name: "品客 咸酸味薯 169g/罐2",
//         sellStatus: 1,
//         merchantDelStatus: 2,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416715,
//         upc: null,
//         skuCode: null,
//         pictures: [
//           "http://p0.meituan.net/shangchao/30d664ba8035430cb48caccc94dd9e4e.jpg"
//         ],
//         poiIds: null,
//         missingRequiredInfo: false
//       },
//       {
//         appFoodCode: null,
//         limitRuleId: null,
//         priceRange: "1.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: "",
//             itemNum: null,
//             id: 426209,
//             sequence: 1,
//             minOrderCount: 1,
//             unit: "份",
//             stock: 1,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 1.0,
//             boxPrice: 0.0,
//             boxNum: 0,
//             weightUnit: "克(g)",
//             upc: "",
//             skuCode: "",
//             skuAttrs: null,
//             spec: "白色",
//             weight: -1.0
//           }
//         ],
//         poiCount: 5,
//         name: "test-纠错送审-运营端提示",
//         sellStatus: 1,
//         merchantDelStatus: 2,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416716,
//         upc: null,
//         skuCode: null,
//         pictures: [
//           "http://p0.meituan.net/xianfu/7c6a1516e8d7457826842bf691a4eaf4282201.jpg"
//         ],
//         poiIds: null,
//         missingRequiredInfo: false
//       },
//       {
//         appFoodCode: null,
//         limitRuleId: null,
//         priceRange: "1.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: null,
//             itemNum: null,
//             id: 426210,
//             sequence: 1,
//             minOrderCount: 1,
//             unit: "份",
//             stock: 1,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 1.0,
//             boxPrice: 0.0,
//             boxNum: 1,
//             weightUnit: "克(g)",
//             upc: "",
//             skuCode: "",
//             skuAttrs: null,
//             spec: "白色",
//             weight: 1.0
//           }
//         ],
//         poiCount: 5,
//         name: "测试商品110612",
//         sellStatus: 1,
//         merchantDelStatus: 2,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416717,
//         upc: null,
//         skuCode: null,
//         pictures: [
//           "http://p1.meituan.net/xianfu/143b80cf297045db17ec703272f1238f335249.jpg"
//         ],
//         poiIds: null,
//         missingRequiredInfo: false
//       },
//       {
//         appFoodCode: null,
//         limitRuleId: "1393133152356016131",
//         priceRange: "2.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: "",
//             itemNum: null,
//             id: 426211,
//             sequence: 1,
//             minOrderCount: 1,
//             unit: "盒",
//             stock: 2,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 2.0,
//             boxPrice: 0.0,
//             boxNum: 1,
//             weightUnit: "克(g)",
//             upc: "3500610124082",
//             skuCode: "",
//             skuAttrs: null,
//             spec: "500g",
//             weight: 500.0
//           }
//         ],
//         poiCount: 3,
//         name: "樂家 礼盒装扁桃仁巧克力糖 500g/盒",
//         sellStatus: 0,
//         merchantDelStatus: 0,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416718,
//         upc: null,
//         skuCode: null,
//         pictures: [
//           "http://p1.meituan.net/xianfu/082597624ddcad4f2f150cb48d916e3f452608.jpg"
//         ],
//         poiIds: null,
//         missingRequiredInfo: false
//       },
//       {
//         appFoodCode: null,
//         limitRuleId: null,
//         priceRange: "20.0",
//         tagCount: 1,
//         skuVoList: [
//           {
//             shelfNum: null,
//             itemNum: null,
//             id: 426212,
//             sequence: 0,
//             minOrderCount: 2,
//             unit: "",
//             stock: 1,
//             ladderPrice: 0.0,
//             ladderNum: 0,
//             price: 20.0,
//             boxPrice: 0.0,
//             boxNum: 0,
//             weightUnit: "毫升(ml)",
//             upc: "",
//             skuCode: "EXCEL-DLC-001",
//             skuAttrs: null,
//             spec: "200ml",
//             weight: 19.0
//           }
//         ],
//         poiCount: 3,
//         name: "excel-dlc-自建-无类目",
//         sellStatus: 1,
//         merchantDelStatus: 2,
//         ctime: "53158-10-01",
//         pic: null,
//         spuId: 4416719,
//         upc: null,
//         skuCode: null,
//         pictures: [""],
//         poiIds: null,
//         missingRequiredInfo: false
//       }
//     ],
//     queryCount: { missingRequiredCount: 9, all: 333 }
//   },
//   message: "SUCCESS",
//   code: 0
// };
