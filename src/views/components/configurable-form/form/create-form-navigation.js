import Vue from 'vue'
import { get } from 'lodash'
import Navigation from '../components/navigation'

export default (form) => Vue.extend({
  name: 'form-navigation-container',
  mounted () {
    this.$nextTick(() => {
      this.height = get(this.$refs, 'navigation.height')
    })
  },
  render (h) {
    const linkList = []
    // 从config中计算出 anchor
    // 当前默认 anchor的item都处于第一层，后期多层的时候，需要考虑目录结构
    form.config.forEach(config => {
      const anchor = get(config, 'options.anchor')
      if (config.mounted && anchor) {
        linkList.push(anchor)
      }
    })
    return h(Navigation, { props: { linkList }, ref: 'navigation' })
  }
})
