import Modal from './instance'
import confirm from './confirm'

Object.entries(confirm).forEach(([key, value]) => {
  Modal[key] = value
})

export default Modal
