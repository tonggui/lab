/**
 * @url reuse/sc/product/hqcc/cube/w/cubeProductValidate
 */
module.exports = function (req) {
  const ProductCubeVos = JSON.parse(req.body.productCubeVos)
  const indexs = []
  const deleteSpuList = []
  const editSpuList = [...ProductCubeVos]
  const delNum = Math.floor(Math.random() * ProductCubeVos.length)
  if (Array.isArray(ProductCubeVos)) {
    while (deleteSpuList.length !== delNum) {
      const randomNum = Math.floor(Math.random() * ProductCubeVos.length)
      if (!indexs.includes(randomNum)) {
        deleteSpuList.push(ProductCubeVos[randomNum])
        indexs.push(randomNum)
        editSpuList.splice(randomNum, 1)
      }
    }
  }
  return {
    "code": 0,
    "msg": "",
    "data": {
      "deleteSpuList": deleteSpuList.map(p => ({ ...p, skus: p.skus.slice(0, 1) })),
      "editSpuList": editSpuList.map(p => ({ ...p, skus: p.skus.slice(0, 1), name: '123' }))
    }
  }
}
