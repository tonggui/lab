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
    beforeCreate () {
      this.form = new Form()
      this.form.init({ data: {}, context: {}, config: [] })
    },
    computed: {
      data: {
        get () {
          return this.form.store.data
        },
        set (data) {
          this.form.setData(data, { replace: true })
        }
      },
      context: {
        get () {
          return this.form.store.context
        },
        set (context) {
          this.form.setContext(context, { replace: true })
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
          this.form.init({
            data: { ...this.value },
            config: config,
            context: { ...this.context }
          })
          this.form.updateDom()
        }
      },
      value: {
        immediate: true,
        handler (value) {
          this.$nextTick(() => {
            if (value === this.data) {
              return
            }
            this.data = value
          })
        }
      },
      data (value) {
        this.$emit('change', value)
      }
    },
    methods: {
      validate (...args) {
        return this.form.validate(...args)
      }
    },
    render (h) {
      const node = this.form.render(h, {
        columnCount: this.attrList.length > 8 ? 2 : 1,
        columnGap: 30
      })
      return h('div', [node])
    }
  })
}
