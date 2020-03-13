/**
 * @url /reuse/sc/product/shangou/audit/r/list
 */
const getList = require('../list/productList')
module.exports = function (req, mock, random) {
  const data = getList(req, mock, random)
  return {
    "code|1": [0, 1],
    msg: '',
    "data|1": [null, data.data]
  }
}
