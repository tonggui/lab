/**
 * @url reuse/sc/product/r/cellularProductStatistics
*/
module.exports = {
  code: 0,
  msg: '',
  data: {
    notExistSpIds: [], // 平台不存在的标品id
    inSellSpIds: [], // 店内已存在且上架的标品id
    "unSellSpIds|10": ["@uuid"], // 店内已存在且未上架的标品id
    "notExistInPoiSpIds|10": ["@uuid"] // 店内不存在的标品id
  }
}
