/**
 * @url reuse/sc/product/hqcc/cube/w/cubeProductValidate
 */
module.exports = function (req) {
  console.log('req.body.hqccParams', req.body)
  const { cubeProductList } = req.body
  const indexs = []
  const deleteSpuList = []
  const editSpuList = [...cubeProductList]
  const delNum = Math.floor(Math.random() * cubeProductList.length)
  // if (Array.isArray(ProductCubeVos)) {
  //   while (deleteSpuList.length !== delNum) {
  //     const randomNum = Math.floor(Math.random() * ProductCubeVos.length)
  //     if (!indexs.includes(randomNum)) {
  //       deleteSpuList.push(ProductCubeVos[randomNum])
  //       indexs.push(randomNum)
  //       editSpuList.splice(randomNum, 1)
  //     }
  //   }
  // }
  return {
    "code": 0,
    "msg": "",
    "data": {
      "deleteSpuList": deleteSpuList,
      "editSpuList": editSpuList
    }
  }
}
