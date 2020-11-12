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
        conNode = `门店名称：${con.wmPoiName || ''}<br>\
        商品编码：${con.sourceFoodCode || ''}<br>\
        商品名称：${con.name || ''}<br>\
        upc编码：${con.upcCode || ''}<br>\
        后台分类：${con.categoryId || ''}<br>\
        药品类别：${con.medicineType || ''}<br>\
        上下架状态：${con.sellStatus || ''}`
        break
    }
  }
  return Object.assign({}, node, { condition: conNode })
}
