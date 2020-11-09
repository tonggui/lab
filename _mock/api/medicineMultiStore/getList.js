/**
 * @url reuse/medicine/product/query/result
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
                spuId: 22111,
                skuId:2134929013,
                sourceFoodCode: '123123',
                'name|1':["酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
                          "可口可乐"],
                upcCode: '123123123123123',
                picture: 'http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg',
                tagName: '商家分类名称1',
                medicineType: 0,
                "medicineTypeName|1": ['处方药',"OTC","通用药","非药品"],
                sellStatus: 0,
                sellStatusName: '上架',
                price: 233,
                stock: 40,
                spec:'450ml',
                weight:23,
                weightUnit:'克(g)'
            },
            {
                wmPoiId: 122,
                wmPoiName: '门店名称',
                spuId: 22222,
                skuId:2134929014,
                sourceFoodCode: '12341234',
                'name|1':["酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
                          "可口可乐"],
                upcCode: '12314231234123123',
                picture: 'http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg',
                tagName: '商家分类名称1',
                medicineType: 1,
                "medicineTypeName|1": ['处方药',"OTC","通用药","非药品"],
                sellStatus: 1,
                sellStatusName: '下架',
                price: 2343,
                stock: 440,
                spec:'450ml',
                weight:243,
                weightUnit:'千克(kg)'
            }
          ]
        }
      }
    }