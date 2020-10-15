import WithPromiseEmit from '@/hoc/withPromiseEmit'
import WithAsyncTask from '@/hoc/withAsyncTask'
import moduleControl from '@/module'
import { POI_DEFAULT_STOCK } from '@/module/moduleTypes'
import { fetchGetTagList } from '@/data/repos/category'
import ProductList from './product-list'

const getDefaultStock = () => {
  const instance = moduleControl.getFelidInstance(POI_DEFAULT_STOCK)
  if (instance.sourceLoaded) {
    return instance.getValue()
  }
  return new Promise(resolve => {
    let defaultStock
    const update = (value) => {
      if (instance.sourceLoaded) {
        defaultStock = value
        instance.removeListener(update)
        resolve(defaultStock)
      }
    }
    instance.addListener(update)
    instance.getValue()
  })
}

const getDefaultTagList = async () => {
  const source = await fetchGetTagList()
  return source
}

export default WithAsyncTask(getDefaultTagList, {
  Loading: 'Loading',
  key: 'source'
})(WithAsyncTask(getDefaultStock, {
  Loading: 'Loading',
  key: 'defaultStock'
})(WithPromiseEmit(ProductList)))
