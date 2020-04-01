<template>
  <div class="sp-apply-form">
    <DynamicForm
      ref="form"
      :context="formContext"
      :data="formData"
      :config="formConfig"
      :hooks="hooks"
      @dataChange="handleDataChange"
      @contextChange="handleContextChange"
    />
    <slot name="footer" v-bind="{ confirm: handleConfirm, cancel: handleCancel }">
      <FormFooter
        isCreateMode
        :auditBtnText="confirmText"
        :submitting="submitting"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </slot>
  </div>
</template>

<script>
  import register from '@sgfe/dynamic-form-vue/src/components/dynamic-form'
  import FormCard from '../product-form/form-card'
  import FormFooter from '../product-form/form-footer'
  import FormItemLayout from './components/form-item-layout'
  import UpcList from './components/upc-list'
  import withDisabled from '@/hoc/withDisabled'

  import createFormConfig from './config'
  import ProductPicture from '@components/product-picture/index'
  import CategoryAttrSelect from '../product-form/components/category-attrs/components/selector'
  import CategoryAttrCascader from '../product-form/components/category-attrs/components/cascader'
  import CategoryAttrBrand from '../product-form/components/category-attrs/components/brand'
  import CategoryAttrText from '../product-form/components/category-attrs/components/text'
  import TagList from '@components/taglist/index'
  import Input from '@/components/input/ValidateInput'
  import CategoryPath from '@components/category-path/index'

  const formConfig = createFormConfig()
  const customComponents = {
    FormCard,
    ProductPicture,
    CategoryAttrSelect,
    CategoryAttrText,
    CategoryAttrCascader,
    CategoryAttrBrand,
    TagList,
    Input,
    UpcList,
    CategoryPath,
    withDisabled
  }

  const formHooks = {
    async onDataChange (key, val, oldValue, item) {
      if (item && item.validateRealTime && item.validate) {
        try {
          await item.validate()
        } catch (e) {
          console.log(e)
        }
      }
    },
    onValidateError (key, error, item) {
      item.validateRealTime = true
    }
  }

  export default {
    name: 'MedicineApplyForm',
    components: {
      FormFooter,
      DynamicForm: register({ components: customComponents, FormItemContainer: FormItemLayout })(formConfig)
    },
    props: {
      context: {
        type: Object,
        default: () => {}
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        formConfig,
        formContext: {
          modules: {
            isManager: false,
            propertyLock: false
          }
        },
        formData: {},
        submitting: false
      }
    },
    computed: {
      confirmText () {
        return '提交审核'
      },
      hooks () {
        return Object.freeze(formHooks)
      }
    },
    watch: {
      data: {
        immediate: true,
        deep: true,
        handler (v = {}) {
          this.formData = Object.assign({}, v)
        }
      },
      context: {
        immediate: true,
        deep: true,
        handler (v = {}) {
          Object.assign(this.formContext, v)
        }
      }
    },
    methods: {
      async validate () {
        if (!this.$refs.form) return
        let error = null
        try {
          error = await this.$refs.form.validate({
            breakWhenErrorOccur: false
          })
          if (error.length) {
            error = error[0]
          }
        } catch (err) {
          error = err.message || err
        }
        if (error) {
          this.$Message.warning(error)
          throw error
        }
      },
      async handleConfirm () {
        this.submitting = true
        try {
          await this.validate()
          await new Promise((resolve, reject) => {
            this.$emit('confirm', this.formData, err => {
              if (err) reject(err)
              else resolve()
            })
          })
        } finally {
          this.submitting = false
        }
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleDataChange (data) {
        this.formData = data
      },
      handleContextChange () {}
    }
  }
</script>

<style lang="less">
  .tips {
    margin-bottom: 0;
    color: @error-color;
    background: #fee;
  }
  .sp-apply-form {
    .footer.sticky {
      z-index: 10;
    }
    .boo-input-wrapper, .boo-select {
      width: 440px;

      > input {
        height: 36px;
      }

      &.boo-select-multiple .boo-tag {
        height: 28px;
        line-height: 28px;
        /deep/ i {
          top: 7px;
        }
      }
    }

    /deep/ .boo-input-suffix,
    /deep/ .boo-input-prefix {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
