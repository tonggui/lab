<template>
  <div class="sp-apply-form">
    <DynamicForm
      ref="form"
      :context="formContext"
      :data="formData"
      :config="formConfig"
      :hooks="hooks"
      @dataChange="handleDataChange"
    />
    <slot name="footer" v-bind="{ confirm: handleConfirm, cancel: handleCancel }">
      <StickyFooter
        :gap="10"
        size="normal"
        :btnTexts="submitBtnTexts"
        :btnProps="submitBtnProps"
        @on-click="handleFooterButtonClick"
      />
    </slot>
  </div>
</template>

<script>
  import { debounce, reverse, pick } from 'lodash'
  import register from '@sgfe/dynamic-form-vue/src/components/dynamic-form'
  import StickyFooter from '@/components/sticky-footer'
  import FormCard from '../product-form/form-card'
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

  // 类目属性的分离处理，用于表单数据显示
  const splitCategoryAttr = (product) => {
    const { categoryAttrValueMap = {}, categoryAttrList = [] } = product || {}
    const primaryAttributeList = categoryAttrList.filter(attr => attr.attrType === 1)
    const normalAttributeList = categoryAttrList.filter(attr => attr.attrType === 3)
    return Object.assign(product, {
      primaryAttributeList,
      primaryAttributesValueMap: pick(categoryAttrValueMap, primaryAttributeList.map(attr => attr.id)),
      normalAttributeList,
      normalAttributesValueMap: pick(categoryAttrValueMap, normalAttributeList.map(attr => attr.id))
    })
  }
  // 类目属性的组合处理，用于表单数据提交
  const combineCategoryAttr = (product) => {
    const {
      primaryAttributeList = [], primaryAttributesValueMap = {},
      normalAttributeList = [], normalAttributesValueMap = {}
    } = product || {}
    return Object.assign(product, {
      categoryAttrList: [].concat(primaryAttributeList, normalAttributeList),
      categoryAttrValueMap: {
        ...primaryAttributesValueMap,
        ...normalAttributesValueMap
      }
    })
  }

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
      StickyFooter,
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
        if (this.formContext.auditing) return '撤销审核'
        if (this.formContext.auditApproved) return '新建此商品'
        return '提交审核'
      },
      hooks () {
        return Object.freeze(formHooks)
      },
      submitBtnTexts () {
        return reverse([
          '取消',
          '保存',
          this.confirmText
        ])
      },
      submitBtnProps () {
        return [
          { loading: this.submitting },
          { loading: this.submitting, style: { display: this.formContext.auditing ? 'none' : 'block' } },
          {}
        ]
      }
    },
    watch: {
      data: {
        immediate: true,
        deep: true,
        handler (v = {}) {
          this.formData = Object.assign({}, splitCategoryAttr(v))
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
          if (error && error.length) {
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
      async handleConfirm (submitAudit = false) {
        this.submitting = true
        try {
          await this.validate()
          await new Promise((resolve, reject) => {
            this.$emit('confirm', submitAudit, combineCategoryAttr(this.formData), err => {
              if (err) reject(err)
              else resolve()
            })
          })
        } finally {
          this.submitting = false
        }
      },
      handleCreate () {
        this.$emit('create', this.formData)
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleRevoke () {
        this.submitting = true
        this.$emit('revoke', () => {
          this.submitting = false
        })
      },
      handleDataChange (data) {
        this.formData = data
      },
      handleFooterButtonClick: debounce(function (idx) {
        if (idx === 0) {
          if (this.formContext.auditing) {
            this.handleRevoke()
          } else if (this.formContext.auditApproved) {
            this.handleCreate()
          } else {
            this.handleConfirm(true)
          }
        } else if (idx === 1) {
          this.handleConfirm(false)
        } else if (idx === 2) {
          this.handleCancel()
        }
      }, 300)
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
