import withPromiseEmit from '@/hoc/withPromiseEmit'
import ProductDelete from './product-delete'

export { optionsWithPoi, defaultOptions } from './constants'

export default withPromiseEmit(ProductDelete)
