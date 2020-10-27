import WithPromiseEmit from '@/hoc/withPromiseEmit'
import ProductList from './product-list'
import WithAsyncTask from '@/hoc/withAsyncTask'
import moduleControl from '@/module'
import { POI_DEFAULT_STOCK } from '@/module/moduleTypes'

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

export const WithProductStock = (Component = ProductList) =>
  WithAsyncTask(getDefaultStock, {
    Loading: 'Loading',
    key: 'defaultStock'
  })(WithPromiseEmit(Component))

export default WithAsyncTask(getDefaultStock, {
  Loading: 'Loading',
  key: 'defaultStock'
})(WithPromiseEmit(ProductList))
