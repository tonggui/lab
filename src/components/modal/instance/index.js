import ModalComponent from './modal'
import withPopper from '@/hoc/withPopper'
import withPromiseEmit from '@/hoc/withPromiseEmit'

export default withPopper(withPromiseEmit(ModalComponent))
