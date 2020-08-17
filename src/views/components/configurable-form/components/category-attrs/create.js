import Vue from 'vue'
import Form from '../../form'
import getConfig from './config'

export default ({ components = {} }) => {
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
      disabled: Boolean,
      allowBrandApply: Boolean
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
          form.setContext(context, { replace: true })
        }
      }
    },
    watch: {
      disabled: {
        immediate: true,
        handler (disabled) {
          this.context = { ...this.context, disabled }
        }
      },
      allowBrandApply: {
        immediate: true,
        handler (allowBrandApply) {
          this.context = { ...this.context, allowBrandApply }
        }
      },
      attrContext: {
        immediate: true,
        handler (attrContext) {
          this.context = { ...this.context, attr: attrContext }
        }
      },
      attrList: {
        immediate: true,
        handler () {
          const config = getConfig(this.attrList, { components })
          form.init({
            data: this.value,
            config: config,
            context: this.context
          })
          form.updateDom()
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
    methods: {
      validate (...args) {
        return form.validate(...args)
      }
    },
    render (h) {
      const node = form.render(h, {
        columnCount: this.attrList.length > 8 ? 2 : 1,
        columnGap: 30
      })
      return h('div', [node])
    }
  })
}
