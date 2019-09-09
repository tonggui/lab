import Vue from 'vue'
import Modal from './modal'

const ModalComponent = Vue.extend(Modal)

let instance = null
export default (props) => {
  if (!instance) {
    const $body = document.body
    const $dom = document.createElement('div')
    $body.appendChild($dom)
    instance = new ModalComponent({
      el: $dom,
      propsData: props
    })
    instance.$nextTick(() => {
      instance.visible = true
    })
  } else {
    Object.entries(props).forEach(([key, value]) => {
      instance[key] = value
    })
    instance.visible = true
  }
  instance.$on('close', () => {
    instance.visible = false
  })
  return instance
}
