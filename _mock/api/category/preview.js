/**
 * @url reuse/sc/product/categoryTemplate/r/preview
 */
module.exports = {
  code: 0,
  msg: '',
  // data: null,
  data: {
    "tagInfoList": [{
      tagId: 0,
      tagName: "未分类",
      categoryIdList: [0], 
    }, {
      tagId: 1,
      tagName: "生鲜果蔬",
      "subTags": [{
        tagId: 11,
        tagName: "桃子",
        categoryIdList: [1, 2, 3, 4],
      }],
      categoryIdList: [1, 2, 3, 4],
    }],
    // "tagInfoList|20": [{
    //   "tagId|+1": 0,
    //   tagName: "@cname",
    //   "topFlag|1": [0, 1],
    //   "topTime": "{\"3\":[{\"end\":\"82500\",\"start\":\"64200\"}],\"1\":[{\"end\":\"82500\",\"start\":\"64200\"}],\"7\":[{\"end\":\"82500\",\"start\":\"64200\"}],\"5\":[{\"end\":\"82500\",\"start\":\"64200\"}]}",
    //   "subTags|0-4": [{
    //     tagId: "@uuid",
    //     tagName: "@cname",
    //     categoryIdList: [1, 2, 3, 4],
    //     "topFlag|1": [0, 1],
    //     "topTime": "{\"3\":[{\"end\":\"82500\",\"start\":\"64200\"}],\"1\":[{\"end\":\"82500\",\"start\":\"64200\"}],\"7\":[{\"end\":\"82500\",\"start\":\"64200\"}],\"5\":[{\"end\":\"82500\",\"start\":\"64200\"}]}",
    //   }],
    //   categoryIdList: [1, 2, 3, 4],

    // }],
  }
};
