import Vue from 'vue'
import Modal from './modal'

const PreviewModal = Vue.extend(Modal)

let instance = null
export default (pictureList, editable, onChange) => {
  const $body = document.body
  const $dom = document.createElement('div')
  $body.appendChild($dom)
  if (!instance) {
    instance = new PreviewModal({
      el: $dom,
      propsData: {
        pictureList,
        visible: false,
        editable
      }
    })
    instance.$nextTick(() => {
      instance.$props.visible = true
    })
  } else {
    instance.$props.pictureList = pictureList
    instance.$props.visible = true
    instance.$props.editable = editable
  }
  instance.$on('close', () => {
    instance.$props.visible = false
  })
  instance.$on('change', (pictureList) => {
    onChange(pictureList)
  })
}
