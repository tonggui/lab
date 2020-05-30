/**
 * @url reuse/sc/product/shangou/cube/r/checkProducts
 */
module.exports = function (req) {
  const { ProductCubeVos } = req.body
  const indexs = []
  const deleteSpuList = []
  const delNum = Math.floor(Math.random() * ProductCubeVos.length)
  if (Array.isArray(ProductCubeVos)) {
    while (deleteSpuList.length !== delNum) {
      const randomNum = Math.floor(Math.random() * ProductCubeVos.length)
      if (!indexs.includes(randomNum)) {
        deleteSpuList.push(ProductCubeVos[randomNum])
        indexs.push(randomNum)
      }
    }
  }
  return {
    "code": 0,
    "msg": "",
    "data": {
      "deleteSpuList": deleteSpuList,
      "editSpuList": deleteSpuList
    }
  }
}