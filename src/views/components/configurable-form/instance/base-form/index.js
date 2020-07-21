import Vue from 'vue'
import createForm from './form'
import { get } from 'lodash'
import FormFooter from '../../components/footer'

const initService = {
  getContext: () => ({}),
  getCategoryAttrs: () => ([])
}

export default (service) => ({ data = {}, context = {} } = {}, {
  components = {},
  plugins = [],
  modules = {},
  validate = []
} = {}) => {
  service = { ...initService, ...service }
  const form = createForm({ data, context }, {
    components,
    plugins,
    modules,
    validate
  })

  return Vue.extend({
    name: 'base-form',
    props: {
      disabled: Boolean,
      isEditMode: Boolean,
      value: {
        type: Object,
        default: () => ({})
      },
      hideCancel: Boolean,
      confirmText: String,
      cancelText: String,
      hideFooter: Boolean
    },
    data () {
      return {
        submitting: false
      }
    },
    watch: {
      disabled: {
        immediate: true,
        handler () {
          this.context = { ...this.context, disabled: this.disabled }
        }
      },
      'value.category.id' () {
        this.getContext()
      },
      data (newValue, oldValue) {
        const newCategoryId = get(newValue, 'category.id')
        const oldCategoryId = get(oldValue, 'category.id')
        if (newCategoryId !== oldCategoryId) {
          if (newValue.categoryAttrList === oldValue.categoryAttrList) {
            this.getCategoryAttrs()
          }
        }
        this.$emit('input', this.data)
      },
      value: {
        immediate: true,
        handler (value) {
          if (value === this.data) {
            return
          }
          this.data = value
        }
      }
    },
    computed: {
      data: {
        get () {
          return form.store.data
        },
        set (data) {
          form.setData(data)
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
    methods: {
      async getContext () {
        this.context = await service.getContext(this.data.category.id)
      },
      async getCategoryAttrs () {
        const categoryId = this.data.category.id
        let categoryAttrList = []
        let categoryAttrValueMap = {}
        try {
          if (categoryId) {
            categoryAttrList = await service.getCategoryAttrs(this.data.category.id)
            categoryAttrValueMap = categoryAttrList.reduce((prev, attr) => {
              prev[attr.id] = this.data.categoryAttrValueMap[attr.id]
              return prev
            }, {})
          }
        } catch (err) {
          console.error(err)
        } finally {
          this.data = { ...this.data, categoryAttrList, categoryAttrValueMap }
        }
      },
      handleCancel () {
        this.$emit('cancel')
      },
      async handleConfirm () {
        try {
          this.submitting = true
          const error = await form.validate()
          if (error) {
            this.$Message.warning(error)
            this.submitting = false
            return
          }
          const stop = await form.submit()
          if (stop) {
            this.submitting = false
            return
          }
          this.$emit('confirm', this.context, () => {
            this.submitting = false
          })
        } catch (err) {
          this.submitting = false
          console.error(err.message)
        }
      },
      renderForm (h) {
        return form.render(h)
      },
      renderFooter (h) {
        let content = null
        if (this.$slots.footer) {
          content = this.$slots.footer
        } else {
          const submit = <Button type="primary" onClick={this.handleConfirm} loading={this.submitting}>{ this.confirmText || this.isEditMode ? '保存商品' : '确认发布商品' }</Button>
          const cancel = this.hideCancel ? null : <Button onClick={this.handleCancel}>{ this.cancelText || '取消' }</Button>
          content = [cancel, submit]
        }
        return (
          <FormFooter sticky={this.isEditMode}>{ content }</FormFooter>
        )
      }
    },
    mounted () {
      this.getContext()

      form.start()
    },
    render (h) {
      const form = this.renderForm(h)
      const footer = this.hideFooter ? null : this.renderFooter(h)
      return h('div', [form, footer])
    }
  })
}
