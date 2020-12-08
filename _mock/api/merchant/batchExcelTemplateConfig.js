/**
 * @url /reuse/sc/product/hqcc/batch/r/config
 */
module.exports = {
  'data': {
    'retailCategoryTpl': {
      'meta': { 'lastModifyTime': 1603382400000, 'version': '1.0.0' },
      'lastModifyTime': -1,
      'version': '1.0.0',
      'url': '//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/product-batch-template/%E5%95%86%E5%93%81%E7%B1%BB%E7%9B%AEid%E8%A1%A8%EF%BC%8820201023%EF%BC%89.xls',
      'fields': []
    },
    'hqccCreateWithCustom': {
      'meta': {
        'lastModifyTime': 1603382400000,
        'fields': 'categoryId,title,originName,brandName,spec,price,stock,weight,weightUnit,upcCode,sourceFoodCode,tagName,subTagName,locatorCode,minSaleCount,sellStatus,description,appFoodCode',
        'version': '1.1.6'
      },
      'lastModifyTime': -1,
      'version': '1.1.6',
      'url': '//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/hqcc-batch-template/%E8%87%AA%E8%A1%8C%E5%88%9B%E5%BB%BA%E5%95%86%E5%93%81%E8%A1%A8%E6%A0%BC%EF%BC%8820201023%EF%BC%89.xls',
      'fields': ['categoryId', 'title', 'originName', 'brandName', 'spec', 'price', 'stock', 'weight', 'weightUnit', 'upcCode', 'sourceFoodCode', 'tagName', 'subTagName', 'locatorCode', 'minSaleCount', 'sellStatus', 'description', 'appFoodCode']
    },
    'hqccCreateWithUpc': {
      'meta': {
        's_col': 1,
        'lastModifyTime': 1557300000000,
        'field_size': 11,
        'fields': 'upcCode,price,stock,tagName,subTagName,sourceFoodCode,locatorCode,minSaleCount,sellStatus,description,appFoodCode',
        'version': '1.1.6',
        's_row': 4
      },
      'lastModifyTime': -1,
      'version': '1.1.6',
      'url': '//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/hqcc-batch-template/%E6%9D%A1%E7%A0%81%E5%8C%B9%E9%85%8D%E5%95%86%E5%93%81%E5%BA%93%E5%95%86%E5%93%81%E8%A1%A8%E6%A0%BC%20(20200807).xls',
      'fields': ['upcCode', 'price', 'stock', 'tagName', 'subTagName', 'sourceFoodCode', 'locatorCode', 'minSaleCount', 'sellStatus', 'description', 'appFoodCode']
    },
    'hqccUpdateTpl': {
      'meta': {
        'lastModifyTime': 1603382400000,
        'fields': 'matchTitle,matchUpc,matchSourceFoodCode,categoryId,title,originName,brandName,spec,price,stock,weight,weightUnit,upcCode,sourceFoodCode,tagName,subTagName,locatorCode,minSaleCount,sellStatus,description,appFoodCode',
        'version': '1.1.6'
      },
      'lastModifyTime': -1,
      'version': '1.1.6',
      'url': '//s3plus.sankuai.com/v1/mss_cf11584f34294f138b03f87308a62093/hqcc-batch-template/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%A8%A1%E7%89%88%EF%BC%8820201023%EF%BC%89.xls',
      'fields': ['matchTitle', 'matchUpc', 'matchSourceFoodCode', 'categoryId', 'title', 'originName', 'brandName', 'spec', 'price', 'stock', 'weight', 'weightUnit', 'upcCode', 'sourceFoodCode', 'tagName', 'subTagName', 'locatorCode', 'minSaleCount', 'sellStatus', 'description', 'appFoodCode']
    }
  }, 'code': 0, 'message': 'SUCCESS'
}
