export const findFirstLeaf = (list) => {
  if (!list || list.length <= 0) {
    return {}
  }
  const node = list[0]
  if (!node.children && node.children.length <= 0) {
    return node
  }
  return findFirstLeaf(node.children)
}
