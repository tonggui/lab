import Vue from 'vue'
import Form from '../../form'
import getConfig from './config'

export default () => {
  const form = new Form()
  form.init({
    data: {},
    context: {},
    config: []
  })
  return Vue.extend({
    name: 'category-attrs',
    props: {
      attrList: {
        type: Array,
        required: true
      },
      attrContext: {
        type: Object,
        default: () => ({})
      },
      value: {
        type: Object,
        default: () => ({})
      },
      disabled: Boolean
    },
    computed: {
      data: {
        get () {
          return form.store.data
        },
        set (data) {
          form.setData(data, { replace: true })
        }
      },
      context: {
        get () {
          return form.store.context
        },
        set (context) {
          form.setContext(context)
        }
      }
    },
    watch: {
      disabled: {
        immediate: true,
        handler () {
          this.context = { ...this.context, disabled: this.disabled }
        }
      },
      attrContext: {
        immediate: true,
        handler () {
          this.context = { ...this.context, ...this.attrContext }
        }
      },
      attrList: {
        immediate: true,
        handler () {
          const config = getConfig(this.attrList)
          form.init({
            data: this.value,
            config: config,
            context: this.context
          })
        }
      },
      value: {
        immediate: true,
        handler (value) {
          if (value === this.data) {
            return
          }
          this.data = value
        }
      },
      data (value) {
        this.$emit('change', value)
      }
    },
    render (h) {
      return h('div', [form.render(h)])
    }
  })
}
