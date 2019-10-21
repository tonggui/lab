import Vue from 'vue'
import withCreateInstance from '@/hoc/withCreateInstance'
import Modal from './modal'

let instance = null

const createInstance = withCreateInstance(Vue.extend(Modal))
export default (props, { onChange, onClose }) => {
  if (!instance) {
    instance = createInstance({
      ...props,
      visible: false
    })
    instance.$nextTick(() => {
      instance.visible = true
    })
  } else {
    instance = createInstance({
      ...props,
      visible: true
    })
  }
  instance.$off('close')
  instance.$off('change')

  instance.$on('change', onChange)
  instance.$on('close', () => {
    instance.visible = false
    onClose()
  })
  return instance
}
