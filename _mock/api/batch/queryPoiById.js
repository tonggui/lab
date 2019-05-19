/**
 * @url /reuse/sc/product/sync_food/queryPoiById
 */
module.exports = function (req) {
  const wmPoiId = +req.body.poiId
  return {
    msg: '',
    code: 0,
    data: {
      wmPoiId: wmPoiId,
      "num|1-100": 1,
      "owner": '@cname',
      "wmPoiBrand": '@name',
      "wmPoiBrandId|1000000-2000000": 1111111,
      "wmPoiName": '@name',
      "tagList": [
        {
          "id|1000-5000": 1000,
          "name": '@name',
          "code": '@guid',
          "level": 1,
          "subTags|0-5": [
            {
              "id|1000-9999": 1000,
              "name": '@name',
              "code": '@guid',
              "level": 2
            }
          ]
        },
        {
          "id|5001-9999": 5001,
          "name": '@name',
          "code": '@guid',
          "level": 1,
          "subTags|0-5": []
        }
      ]
    }
  }
}
