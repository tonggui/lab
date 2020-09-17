/**
 * @url /reuse/sc/product/hqcc/batch/r/config
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    createWithEan: {
      url: "//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/product-batch-template/%E6%9D%A1%E7%A0%81%E5%8C%B9%E9%85%8D%E5%95%86%E5%93%81%E5%BA%93%E5%95%86%E5%93%81%E8%A1%A8%E6%A0%BC.xls",
      meta: {
        lastModifyTime: 1597313038075,
        version: "1.1.2",
        fields: "upcCode,price,stock,tagName,subTagName,sourceFoodCode,locatorCode,minSaleCount,sellStatus,description,appFoodCode"
      }
    },
    createWithoutEan: {
      url: "//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/product-batch-template/%E8%87%AA%E8%A1%8C%E5%88%9B%E5%BB%BA%E5%95%86%E5%93%81%E8%A1%A8%E6%A0%BC%EF%BC%8820200608%EF%BC%89.xls",
      meta: {
        lastModifyTime: 1597313038075,
        version: "1.1.5",
        fields: "categoryId,title,originName,brandName,spec,price,stock,weight,weightUnit,upcCode,sourceFoodCode,tagName,subTagName,locatorCode,minSaleCount,sellStatus,description,appFoodCode"
      }
    },
    updateTpl: {
      url: "//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/product-batch-template/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%A8%A1%E7%89%88%EF%BC%8820200608%EF%BC%89.xls",
      meta: {
        lastModifyTime: 1597313038075,
        version: "1.1.5",
        fields: "matchTitle,matchUpc,matchSourceFoodCode,matchSkuId,categoryId,title,originName,brandName,spec,price,stock,weight,weightUnit,upcCode,sourceFoodCode,tagName,subTagName,locatorCode,minSaleCount,sellStatus,description,appFoodCode"
      }
    }
  }
}
