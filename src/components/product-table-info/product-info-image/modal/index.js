import Vue from 'vue'
import Modal from './modal'

const PreviewModal = Vue.extend(Modal)

let instance = null
export default ({ pictureList, editable, video }, onChange) => {
  if (!instance) {
    const $body = document.body
    const $dom = document.createElement('div')
    $body.appendChild($dom)
    instance = new PreviewModal({
      el: $dom,
      propsData: {
        pictureList,
        visible: false,
        editable,
        video
      }
    })
    instance.$nextTick(() => {
      instance.$props.visible = true
    })
  } else {
    instance.$props.pictureList = pictureList
    instance.$props.visible = true
    instance.$props.editable = editable
    instance.$props.video = video
  }
  instance.$on('close', () => {
    instance.$props.visible = false
  })
  instance.$on('change', onChange)
  return instance
}
