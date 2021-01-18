/**
 * @url reuse/mpc/product/r/listAllPaddingPoi
 */
module.exports = function () {
  const list = []
  for (let i = 1; i <= 1000; i++) {
    list.push({
      id: i,
      name: '的范德萨范' + i,
      address: '东北' + i
    })
  }
  return {
    code: 0,
    msg: '',
    data: {
      list,
      total: 1000
    }
  }
}
