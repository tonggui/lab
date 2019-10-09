/**
 * @url /reuse/sc/product/retail/r/listPageModel
 */
module.exports = function() {
  return {
    code: 0,
    msg: '',
    data: {
      errorProductCount: 20,
      packetSupport: 1,
      categoryTemplateGray: true,
      hasTransitionProduct: 1,
      unRelationProductCount: 20,
      maxFirstTagConfig: {
        maxFirstLevelNum: 1,
        url: 'http://www.baidu.com',
        content: '百度'
      },
      taskId: 0,
      sleep: 10000,
    }
  };
}
