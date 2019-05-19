/**
 * @url /reuse/sc/product/retail/r/tagList
 */
const Mockjs = require('mockjs');

const data = Mockjs.mock({
  'tagList|30': [{
    name: '@cname',
    "id|+1": 1000001,
    productCount: 10,
    smartSort: true,
    appTagCode: 'aaaaa',
    'defaultFlag|1': [0, 1],
    "subTags|1-5": [{
      name: '@cname',
      "id|+1": 1,
      appTagCode: 'bbbbb',
      productCount: 10,
      'defaultFlag|1': [0, 1],
    }]
  }]
});

module.exports = {
  msg: 'handleFixedScroll',
  code: 0,
  // 'data': []
  data: {
    totalCount: 0,
    tagList: [{
      name: '@cname',
      "id": 96851308,
      productCount: 0,
      topFlag: 1,
      timeZone: '{"1":[{"end":"14:14","start":"14:12"}],"7":[{"end":"14:14","start":"14:12"}]}',
      timeZoneForHuman: '每周一日<br />14:12-14:14',
      timeZoneObj: {
        '1': [
          {end: "14:14", time: "14:12-14:14", start: "14:12"},
        ],
        '7': [
          {end: "14:14", time: "14:12-14:14", start: "14:12"},
        ],
      },
    }, ...data.tagList,],
    smartSortSwitch: true,
    tagToTopLimit: 5,
  }
};
