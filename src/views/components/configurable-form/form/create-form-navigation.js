import Vue from 'vue'
import { get } from 'lodash'
import Navigation from '../components/navigation'

export default (form) => Vue.extend({
  name: 'form-navigation-container',
  render (h) {
    const linkList = []
    form.config.forEach(config => {
      const anchor = get(config, 'options.anchor')
      if (config.mounted && anchor) {
        linkList.push(anchor)
      }
    })
    return h(Navigation, { props: { linkList } })
  }
})
