import { fetchMultiCubeDefaultStock } from '@/data/repos/merchantCube'
import { fetchGetTagList } from '@/data/repos/merchantCategory'
import ProductList from './product-list'
// import { WithProductStock } from '@/views/product-recommend/pages/product-recommend-edit/components/product-list'
import WithAsyncTask from '@/hoc/withAsyncTask'
import WithPromiseEmit from '@/hoc/withPromiseEmit'

const getDefaultTagList = async () => {
  const source = await fetchGetTagList()
  return source
}

export const WithProductStock = (Component = ProductList) =>
  WithAsyncTask(fetchMultiCubeDefaultStock, {
    Loading: 'Loading',
    key: 'defaultStock'
  })(WithPromiseEmit(Component))

export default WithAsyncTask(getDefaultTagList, {
  Loading: 'Loading',
  key: 'sourceTagList'
})(WithProductStock(ProductList))
