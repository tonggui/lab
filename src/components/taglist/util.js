export const getPathById = (id, tagList) => {
  let result = []
  for (let i = 0; i < tagList.length; i++) {
    const tag = tagList[i]
    if (tag.id === id) {
      result.push(tag)
      break
    } else if (tag.children) {
      const path = getPathById(id, tag.children) || []
      if (path.length > 0) {
        result = result.concat(tag, path)
        break
      }
    }
  }
  return result
}

const getFlatPath = tag => {
  if (tag.children && tag.children.length) {
    return tag.children.map(t => [tag].concat(...getFlatPath(t)))
  }
  return [[tag]]
}

export const searchPath = (search, tagList) => {
  let result = []
  for (let i = 0; i < tagList.length; i++) {
    const tag = tagList[i]
    if (tag.name.includes(search)) {
      result = result.concat(getFlatPath(tag))
    } else if (tag.children) {
      const paths = searchPath(search, tag.children)
      if (paths.length > 0) {
        result = result.concat(paths.map(path => [tag].concat(path)))
      }
    }
  }
  return result
}
