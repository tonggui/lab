/**
 * @url reuse/sc/product/categoryTemplate/r/getDetail
 */
module.exports = function(req) {
  return {
    code: 0,
    msg: '',
    data: {
      templateId: "@uuid",
      templateTitle: "@cname",
      usageQuantity: 12,
      avClassificateConvert: "@float(1, 100, 2, 2)",
      "tagInfoList|20": [{
        tagId: "@uuid",
        tagName: "@cname",
        "subTags|0-4": [{
          tagId: "@uuid",
          tagName: "@cname",
          categoryIdList: [1, 2, 3, 4],
          "updateFlag|1": [0, 1],
        }],
        categoryIdList: [1, 2, 3, 4],
        "updateFlag|1": [0, 1], 
      }],
      "useScene": "由模版配置后台提供填写入口，限定200字以内",
      timeStamp: "@date",
      "type|1": [1, 2],
    },
  };
};
