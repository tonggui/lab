/**
 * @url /health/pc/medicineSaleRule/citys
 * 接口文档地址 https://km.sankuai.com/page/550373542
 */
module.exports = function(req) {
  return {
    code: 0,
    msg: '',
    data: [ {cityId: 1, cityName: '北京'}, {cityId: 2, cityName: '上海'} ]
  }
}
