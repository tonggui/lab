/**
 * @url /reuse/medicine/product/city/list
 * 接口文档地址 https://km.sankuai.com/page/550373542
 */
module.exports = function(req) {
  return {
    code: 0,
    msg: '',
    'data|5': [
      {
        'cityPinYin': [],
        'cityName|+1': ['北京', '天津', '上海', '武汉', '河北'],
        'cityId|+1': 458,
      }
    ]
  }
}
