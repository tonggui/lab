/**
 * 选择的商品分类map转化为已选商品列表
 */
export function objToList (obj) {
  return Object.values(obj).reduce((a, b) => { a.push(...b); return a }, [])
}
