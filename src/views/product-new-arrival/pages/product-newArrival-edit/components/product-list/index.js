import { fetchGetTagList } from '@/data/repos/category'
import ProductList from './product-list'
import { WithProductStock } from '@/views/product-recommend/pages/product-recommend-edit/components/product-list'
import WithAsyncTask from '@/hoc/withAsyncTask'

const getDefaultTagList = async () => {
  const source = await fetchGetTagList()
  return source
}

export default WithAsyncTask(getDefaultTagList, {
  Loading: 'Loading',
  key: 'source'
})(WithProductStock(ProductList))
