import Vue from 'vue'
import { Tabs, TabPane, Affix } from '@roo-design/roo-vue'
import { get } from 'lodash'

export default (form) => Vue.extend({
  name: 'form-navigation',
  data () {
    return {
      value: undefined
    }
  },
  watch: {
    '$route.hash': {
      immediate: true,
      handler (hash) {
        this.value = hash
      }
    }
  },
  methods: {
    renderPane (h, config) {
      const anchor = get(config, 'options.anchor')
      const { link, name } = anchor
      const renderLabel = (render) => {
        return render('a', {
          domProps: { href: link }
        }, [name])
      }
      return h(TabPane, { props: {
        label: renderLabel,
        name: link
      } })
    }
  },
  render (h) {
    const pane = form.config.filter(config => config.mounted && get(config, 'options.anchor'))
    const $pane = pane.map((config) => this.renderPane(h, config))
    return h(Affix, [h(Tabs, {
      style: {
        background: '#fff'
      },
      props: {
        value: this.value
      }
    }, $pane)])
  }
})
