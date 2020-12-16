import Vue from 'vue'
import NavActions from '../components/navActions'

export default (form) => Vue.extend({
  name: 'form-navActions-container',
  render (h) {
    // 从context-features中获得是否需要展示纠错入口
    const allowCorrectSp = form.context.features.allowCorrectSp
    return h(NavActions, { props: { productData: form.data, allowCorrectSp } })
  }
})
