/**
 * @url reuse/medicine/product/medicineSaleRule/list
*/
module.exports = function (req) {
  return {
    code: 0,
    msg: '',
    data: {
      totalCount: 300,
      totalNo: 15,
      pageSize: 20,
      pageNo: 1,
      list: [
          {
              brandName: '品牌1',
              cityName: '北京',
              purchaseTypeDesc: '登记个人信息购买',
              matchingRulesDesc: '商品名称关键词',
              productInfo: '酷儿维生素C,钙香橙汁450ml酷儿维生素C,钙香橙汁450ml,可口可乐'
          },
          {
            brandName: '品牌2',
            cityName: '西安',
            purchaseTypeDesc: '仅到店自取',
            matchingRulesDesc: 'UPC',
            productInfo: '酷儿维生素C,钙香橙汁450ml酷儿维生素C,钙香橙汁450ml,可口可乐'
          },
          {
            brandName: '品牌2',
            cityName: '西安',
            purchaseTypeDesc: '仅到店自取',
            matchingRulesDesc: 'UPC',
            productInfo: '酷儿维生素C,钙香橙汁450ml酷儿维生素C,钙香橙汁450ml,可口可乐'
          },
          {
            brandName: '品牌2',
            cityName: '西安',
            purchaseTypeDesc: '仅到店自取',
            matchingRulesDesc: 'UPC',
            productInfo: '酷儿维生素C,钙香橙汁450ml酷儿维生素C,钙香橙汁450ml,可口可乐'
          },
          {
            brandName: '品牌2',
            cityName: '西安',
            purchaseTypeDesc: '仅到店自取',
            matchingRulesDesc: 'UPC',
            productInfo: '酷儿维生素C,钙香橙汁450ml酷儿维生素C,钙香橙汁450ml,可口可乐'
          },
          {
            brandName: '品牌2',
            cityName: '西安',
            purchaseTypeDesc: '仅到店自取',
            matchingRulesDesc: 'UPC',
            productInfo: '酷儿维生素C,钙香橙汁450ml酷儿维生素C,钙香橙汁450ml,可口可乐'
          }
        ]
      }
    }
  }
