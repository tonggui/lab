/**
 * @url reuse/sc/product/shangou/cube/r/getRecTagList
 */
// module.exports = require('../list/categoryList')
const tagList = [{
  name: '未分类',
  "id": 1,
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
  name: '测试分类1',
  "id": 2,
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
    name: '测试分类123测试分类123',
    "id": 12,
    appTagCode: 'bbbbb',
    productCount: 10,
    'defaultFlag|1': [0, 1],
    isLeaf: 1
  }]
}, {
  name: '测试分类2',
  "id": 3,
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
}]
module.exports = function (req) {
  const { keyword } = req.body
  return {
    msg: 'handleFixedScroll',
    code: 0,
    data: {
      tagOptional: 0,
      totalCount: 0,
      tagList: tagList.filter(item => item.name.indexOf(keyword) !== -1),
      smartSortSwitch: true,
      tagToTopLimit: 5,
    }
  }
};