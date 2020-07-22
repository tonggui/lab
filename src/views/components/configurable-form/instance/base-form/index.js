import Vue from 'vue'
import createForm from './form'
import { get, merge } from 'lodash'
import FormFooter from '../../components/footer'

const initService = {
  getContext: () => ({}),
  getCategoryAttrs: () => ([])
}

// 获取类目属性
export default (service = {}) => ({ data = {}, context = {} } = {}, {
  components = {},
  plugins = [],
  validate = []
} = {}) => {
  service = { ...initService, ...service }
  const form = createForm({ data, context }, { components, plugins, validate })

  return Vue.extend({
    name: 'base-form',
    props: {
      value: {
        type: Object,
        default: () => ({})
      },
      context: {
        type: Object,
        default: () => ({})
      },
      disabled: Boolean,
      isEditMode: Boolean,
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
          this.formContext = { ...this.formContext, disabled: this.disabled }
          console.log('disabled', Object.keys(this.formContext))
        }
      },
      'formData.category.id' () {
        this.getContext()
      },
      formData (newValue, oldValue) {
        const newCategoryId = get(newValue, 'category.id')
        const oldCategoryId = get(oldValue, 'category.id')
        if (newCategoryId !== oldCategoryId) {
          if (newValue.categoryAttrList === oldValue.categoryAttrList) {
            this.getCategoryAttrs()
          }
        }
        this.$emit('input', this.formData)
        this.$emit('change', this.formData)
      },
      formContext () {
        this.$emit('context-change', this.formContext)
      },
      context: {
        immediate: true,
        handler (value) {
          if (value === this.formContext) {
            return
          }
          this.formContext = value
          console.log('context change', Object.keys(this.formContext))
        }
      },
      value: {
        immediate: true,
        handler (value) {
          if (value === this.formData) {
            return
          }
          this.formData = value
        }
      }
    },
    computed: {
      formData: {
        get () {
          return form.store.data
        },
        set (data) {
          form.setData(data)
        }
      },
      formContext: {
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
        const context = await service.getContext(this.formData.category.id)
        this.formContext = merge({}, context, this.context)
        console.log('getContext', Object.keys(this.formContext))
      },
      async getCategoryAttrs () {
        const categoryId = this.formData.category.id
        let categoryAttrList = []
        let categoryAttrValueMap = {}
        try {
          if (categoryId) {
            categoryAttrList = await service.getCategoryAttrs(this.formData.category.id)
            categoryAttrValueMap = categoryAttrList.reduce((prev, attr) => {
              prev[attr.id] = this.formData.categoryAttrValueMap[attr.id]
              return prev
            }, {})
          }
        } catch (err) {
          console.error(err)
        } finally {
          this.formData = { ...this.formData, categoryAttrList, categoryAttrValueMap }
        }
      },
      handleCancel () {
        this.$emit('cancel')
      },
      async handleConfirm () {
        try {
          this.submitting = true
          let error
          // 外部的validate
          if (this.$listeners.validate) {
            error = await new Promise((resolve) => {
              this.$emit('validate', resolve)
            })
          }
          if (!error) {
            error = await form.validate()
          }
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
          this.$emit('confirm', () => {
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
