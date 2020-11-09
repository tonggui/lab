import { MUT_MODE } from '@/views/progress/constants'

export const convertTaskDetailCondition = (node) => {
  if (!node.condition) return node
  const con = JSON.parse(node.condition)
  let conNode = ''
  if (con.ruleType) {
    switch (con.ruleType) {
      case MUT_MODE.NAME:
        conNode = `分类：${con.tagName || ''}<br>商品名称：${con.productName || ''}<br>规格：${con.specName || ''}`
        break
      case MUT_MODE.UPC:
        conNode = con.upc
        break
      case MUT_MODE.SKU:
        conNode = con.sku
        break
      case MUT_MODE.PACKAGE_PRODUCT_NAME:
        conNode = `组包商品名称：${con.productName || ''}`
        break
      case MUT_MODE.MEDICINE_MUlTI_STORE:
        conNode = con.sku
        break
    }
  }
  return Object.assign({}, node, { condition: conNode })
}
