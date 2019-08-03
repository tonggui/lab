import Vue from 'vue'
import Modal from './modal'

const PreviewModal = Vue.extend(Modal)

export default (pictureList) => {
  const $body = document.body
  const $dom = document.createElement('div')
  $body.appendChild($dom)
  const instance = new PreviewModal({
    el: $dom,
    propsData: {
      pictureList,
      visible: true
    }
  })
  instance.$on('close', function () {
    this.$el.parentNode.removeChild(this.$el)
  })
}
