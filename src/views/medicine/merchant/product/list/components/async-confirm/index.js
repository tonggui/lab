import withPromiseEmit from '@/hoc/withPromiseEmit'
import AsyncConfirm from './async-confirm'

export { ASYNC_TYPE } from './constants'

export default withPromiseEmit(AsyncConfirm)
