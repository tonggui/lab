import Vue from 'vue'
import Modal from './modal'

const ModalComponent = Vue.extend(Modal)

let instance = null
export default (props, listeners) => {
  if (!instance) {
    const $body = document.body
    const $dom = document.createElement('div')
    $body.appendChild($dom)
    instance = new ModalComponent({
      el: $dom,
      propsData: {
        ...props
      }
    })
    instance.$nextTick(() => {
      instance.$props.visible = true
    })
  } else {
    Object.entries(props).forEach(([key, value]) => {
      instance.$props[key] = value
    })
    instance.$props.visible = true
  }
  instance.$on('close', () => {
    instance.$props.visible = false
  })
  instance.$on('change', listeners.onChange)
}
