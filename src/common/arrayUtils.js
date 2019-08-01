export const updateArrayWith = (arr, value, fn) => {
  const index = arr.findIndex(fn)
  if (index < 0) {
    return arr
  }
  return [...arr].splice(index, 1, value)
}
export const swapArrayByIndex = (arr, oldIndex, newIndex) => {
  const result = [...arr]
  result.splice(newIndex, 0, result.splice(oldIndex, 1)[0])
  return result
}
export const updateTreeWithPath = (arr, pathList, value) => {
  if (pathList.length <= 0) {
    return value
  }
  const path = pathList[0]
  const index = arr.findIndex(i => i.id === path)
  const node = arr[index]
  const newChildren = updateTreeWithPath(node.children, pathList.slice(1), value)
  const result = [...arr]
  result[index] = {
    ...node,
    children: newChildren
  }
  return result
}
