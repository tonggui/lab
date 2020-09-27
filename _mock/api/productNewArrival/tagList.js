/**
 * @url reuse/sc/product/shangou/cube/r/v2/getRecTagList
 */
// module.exports = require('../list/categoryList')
const tagList = [{
  tagName: '未分类',
  "tagId": 1,
  productCount: 2,
  isLeaf: 1,
  topFlag: 0,
  timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
  timeZoneForHuman: '每周一日<br />14:12-14:14',
  timeZoneObj: {
    '1': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
    '7': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
  }
}, {
  tagName: '测试分类1',
  "tagId": 2,
  productCount: 3,
  isLeaf: 1,
  topFlag: 0,
  timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
  timeZoneForHuman: '每周一日<br />14:12-14:14',
  timeZoneObj: {
    '1': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
    '7': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
  },
  "subTags": [{
    tagName: '测试分类123测试分类123',
    "tagId": 12,
    appTagCode: 'bbbbb',
    productCount: 10,
    'defaultFlag|1': [0, 1],
    isLeaf: 1
  }]
}, {
  tagName: '测试分类2',
  "tagId": 3,
  productCount: 11,
  isLeaf: 1,
  topFlag: 0,
  timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
  timeZoneForHuman: '每周一日<br />14:12-14:14',
  timeZoneObj: {
    '1': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
    '7': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
  },
}, {
  tagName: '测试分类3',
  "tagId": 5,
  productCount: 11,
  isLeaf: 1,
  topFlag: 0,
  timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
  timeZoneForHuman: '每周一日<br />14:12-14:14',
  timeZoneObj: {
    '1': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
    '7': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
  },
}, {
  tagName: '测试分类4',
  "tagId": 6,
  productCount: 11,
  isLeaf: 1,
  topFlag: 0,
  timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
  timeZoneForHuman: '每周一日<br />14:12-14:14',
  timeZoneObj: {
    '1': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
    '7': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
  },
}, {
  tagName: '测试分类5',
  "tagId": 8,
  productCount: 3,
  isLeaf: 1,
  topFlag: 0,
  timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
  timeZoneForHuman: '每周一日<br />14:12-14:14',
  timeZoneObj: {
    '1': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
    '7': [
      { end: "14:14", time: "14:12-14:14", start: "14:12" },
    ],
  },
  "subTags": [{
    tagName: '测试分类123测试分类123',
    "tagId": 12,
    appTagCode: 'bbbbb',
    productCount: 10,
    'defaultFlag|1': [0, 1],
    isLeaf: 1
  }]
}]
module.exports = function (req) {
  const { keyword } = req.body
  return {
    msg: 'handleFixedScroll',
    code: 0,
    data: {
      tagOptional: 0,
      totalProductCount: 0,
      tagInfoList: tagList.filter(item => item.tagName.indexOf(keyword) !== -1),
      smartSortSwitch: true,
      tagToTopLimit: 5,
    }
  }
};
