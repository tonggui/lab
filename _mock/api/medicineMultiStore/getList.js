/**
 * @url reuse/sc/product/medicine/query/result
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
        resultList: [
            {
                wmPoiId: 111,
                wmPoiName: '门店名称',
                spuId: 22,
                sourceFoodCode: '123123',
                'name|1':["酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
                          "可口可乐"],
                upcCode: '123123123123123',
                picture: 'http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg',
                tagName: '商家分类名称',
                categoryName1:'一级后台分类名称',
                categoryName2: '2级后台分类名称',
                categoryName3: '3级后台分类名称',
                medicineType: 0,
                "medicineTypeName|1": ['处方药',"OTC","通用药","非药品"],
                sellStatus: 0,
                sellStatusName: '上架',
                price: 233,
                stock: 40,
                wmProductSkus: [{
                  id: 0,
                  upcCode: 123,
                  price: 10,
                  stock: 0,
                  spec: '450ml'
                }, {
                  id: 1,
                  upcCode: 123,
                  price: 12345.12,
                  stock: 0,
                  spec: '450ml'
                }, {
                  id: 2,
                  upcCode: 123,
                  price: 12345.12,
                  stock: 0,
                  spec: '150ml'
                }],
            }
        ]
      }
    }
  }