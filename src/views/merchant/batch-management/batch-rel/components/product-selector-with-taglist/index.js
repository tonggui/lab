import withAsyncTask from '@/hoc/withAsyncTask'
import { fetchGetTagList } from '@/data/repos/merchantCategory'
import ProductSelector from './product-selector'

const convertTagList = (tagList = []) => {
  tagList.forEach(tag => {
    if (tag.children.length === 0 && tag.productCount > 0) {
      delete tag.children
      tag.isLeaf = false
      tag._isLeaf = true
      tag.total = tag.productCount
    }
    convertTagList(tag.children)
  })
  return tagList
}

export default withAsyncTask(() => fetchGetTagList().then(convertTagList), {
  key: 'tagList'
})(ProductSelector)
