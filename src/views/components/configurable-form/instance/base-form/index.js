import Vue from 'vue'
import createForm from './form'
import { get, merge } from 'lodash'
import FormFooter from '../../components/footer'
import { splitCategoryAttrMap } from '@/data/helper/category/operation'
// import { SPU_FIELD } from '../../field'

// 获取类目属性
export default (service) => ({ data = {}, context = {}, initialData = {} } = {}, {
  components = {},
  plugins = [],
  validate = []
} = {}) => {
  return Vue.extend({
    name: 'base-form',
    props: {
      navigation: Boolean,
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
    beforeCreate () {
      this.form = createForm({ data, context, initialData }, { components, plugins, validate })
      console.log('beforeCreate', this)
    },
    // created () {
    //   this.form = form
    // },
    watch: {
      disabled: {
        immediate: true,
        handler () {
          this.formContext = { ...this.formContext, disabled: this.disabled }
        }
      },
      'formData.category.id' () {
        this.getContext()
      },
      formData (newValue, oldValue) {
        const newCategoryId = get(newValue, 'category.id')
        const oldCategoryId = get(oldValue, 'category.id')
        if (newCategoryId !== oldCategoryId) {
          if (newValue.normalAttributes === oldValue.normalAttributes) {
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
          return this.form.store.data
        },
        set (data) {
          this.form.setData(data)
        }
      },
      formContext: {
        get () {
          return this.form.store.context
        },
        set (context) {
          this.form.setContext(context)
        }
      }
    },
    methods: {
      async getContext () {
        const context = await service.getContext(this.formData.category.id)
        this.formContext = merge({}, context, this.context)
      },
      async getCategoryAttrs () {
        const categoryId = this.formData.category.id
        let categoryAttrList = []
        let categoryAttrValueMap = {}
        try {
          if (categoryId) {
            categoryAttrList = await service.getCategoryAttrs(this.formData.category.id)
            const currentAttrValueMap = { ...this.formData.normalAttributesValueMap, ...this.formData.sellAttributesValueMap }
            categoryAttrValueMap = categoryAttrList.reduce((prev, attr) => {
              prev[attr.id] = currentAttrValueMap[attr.id]
              return prev
            }, {})
          }
        } catch (err) {
          console.error(err)
        } finally {
          const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.formData = { ...this.formData, ...categoryAttr }
        }
      },
      async validate (options) {
        try {
          let error
          // 外部的validate
          if (this.$listeners.validate) {
            error = await new Promise((resolve) => {
              this.$emit('validate', resolve)
            })
          }
          if (!error) {
            error = await this.form.validate(options)
          }
          return error
        } catch (err) {
          return err.message || err
        }
      },
      async submit () {
        const stop = await this.form.submit()
        return stop
      },
      handleCancel () {
        this.$emit('cancel')
      },
      async handleConfirm () {
        try {
          this.submitting = true
          const error = await this.validate()
          if (error) {
            this.$Message.warning(error)
            this.submitting = false
            return
          }
          const stop = await this.submit()
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
        return this.form.render(h, { navigation: this.navigation })
      },
      renderFooter (h) {
        let content = null
        if (this.$slots.footer) {
          content = this.$slots.footer
        } else {
          const submit = <Button type="primary" onClick={this.handleConfirm} loading={this.submitting}>{ this.confirmText || (this.isEditMode ? '保存商品' : '确认发布商品') }</Button>
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

      this.form.start()
    },
    render (h) {
      const form = this.renderForm(h)
      const footer = this.hideFooter ? null : this.renderFooter(h)
      return h('div', [form, footer])
    }
  })
}
