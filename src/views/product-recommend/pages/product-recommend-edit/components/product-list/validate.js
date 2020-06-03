import {
  isIncompleteProductInfo,
  getUniqueId
} from '@/views/product-recommend/utils'

const createError = (id) => ({
  __id__: id,
  code: 'incomplete',
  message: '商品信息未填充完整'
})

export default (productList) => {
  debugger
  let errorInfo = {}
  // 商品信息是否完整校验
  productList.forEach(product => {
    const id = getUniqueId(product)
    if (isIncompleteProductInfo(product)) {
      errorInfo[id] = createError(id)
    }
  })
  return errorInfo
}
