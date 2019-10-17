import Vue from 'vue'
import withCreateInstance from '@/hoc/withCreateInstance'
import Modal from './modal'

let instance = null

const createInstance = withCreateInstance(Vue.extend(Modal))

export default (props, onChange) => {
  if (!instance) {
    instance = createInstance({
      ...props,
      visible: false
    })
    instance.$nextTick(() => {
      instance.visible = true
    })
    instance.$on('close', () => {
      instance.visible = false
    })
    instance.$on('change', onChange)
  } else {
    instance = createInstance({
      ...props,
      visible: true
    })
  }
  return instance
}
