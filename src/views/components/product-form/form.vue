<template>
  <div>
    <DynamicForm
      class="product-form"
      ref="form"
      :config="formConfig"
      :context="formContext"
      :data="productInfo"
    />
    <slot name="footer" v-bind="{ isCreate: isCreateMode, confirm: handleConfirm, cancel: handleCancel }">
      <FormFooter
        :is-create="isCreateMode"
        :on-confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </slot>
  </div>
</template>

<script>
  import DynamicForm from '@/components/dynamic-form'
  import { getContext } from '@/components/dynamic-form/context'
  import FormCard from './form-card'
  import FormFooter from './form-footer'
  import FormItemLayout from './form-item-layout'

  import ChooseProduct from './components/choose-product'
  import CategoryAttrs from './components/category-attrs'
  import ProductPicture from '@/components/product-picture'
  import TagList from '@/components/taglist'
  import Brand from '@/components/brand'
  import Origin from './components/origin'
  import Input from './components/Input'
  import ProductAttributes from '@/components/product-attribute/product-attribute-list'
  import ProductLabel from '@/components/product-label'
  import SaleTime from './components/sale-time'
  import CategoryPath from '@/components/category-path'
  import PicDetails from '@/components/pic-details'

  import { getInitRules } from '@/data/constants/product'
  import getFormConfig from './config'
  import {
    createInitialProduct,
    splitCategoryAttrMap,
    combineCategoryMap
  } from './data'

  export default {
    name: 'ProductForm',
    components: {
      FormFooter,
      DynamicForm: DynamicForm({
        FormCard,
        ChooseProduct,
        ProductPicture,
        CategoryAttrs,
        ProductLabel,
        ProductAttributes,
        TagList,
        Brand,
        Origin,
        SaleTime,
        Input,
        CategoryPath,
        PicDetails
      }, FormItemLayout)
    },
    props: {
      spuId: [String, Number],
      product: {
        type: Object,
        default: () => createInitialProduct()
      },
      tagList: Array,
      preferences: {
        type: Object,
        default: () => ({})
      },
      modules: {
        type: Object,
        default: () => ({})
      },
      onConfirm: Function,
      onCancel: Function
    },
    data () {
      return {
        productInfo: this.product,
        normalAttributes: [],
        sellAttributes: []
      }
    },
    computed: {
      isCreateMode () {
        return !this.spuId
      },
      modeString () {
        return this.isCreateMode ? '修改' : '新建'
      },
      whiteList () {
        return getInitRules()
      }
    },
    watch: {
      product: {
        immediate: true,
        handler (product) {
          const { categoryAttrList, categoryAttrValueMap } = product
          const {
            normalAttributes,
            normalAttributesValueMap,
            sellAttributes,
            sellAttributesValueMap
          } = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.normalAttributes = normalAttributes
          this.sellAttributes = sellAttributes
          if (this.formContext) {
            this.formContext.normalAttributes = normalAttributes
            this.formContext.sellAttributes = sellAttributes
          }
          this.productInfo = {
            ...this.product,
            normalAttributesValueMap,
            sellAttributesValueMap
          }
        }
      },
      preferences (val) {
        this.formContext.preferences = val || {}
      },
      modules (val) {
        this.formContext.modules = val || {}
      }
    },
    methods: {
      async handleConfirm () {
        this.$emit('confirm')
        if (this.$refs.form) {
          try {
            await this.$refs.form.validate()
          } catch {
            return
          }
        }
        if (this.onConfirm) {
          const product = this.$refs.form.formData
          const {
            categoryAttrList,
            categoryAttrValueMap
          } = combineCategoryMap(this.context.normalAttributes, this.context.sellAttributes, product.normalAttributesValueMap, product.sellAttributesValueMap)
          await this.onConfirm({
            ...product,
            categoryAttrList,
            categoryAttrValueMap
          })
        }
      },
      async handleCancel () {
        this.$emit('cancel')
        if (this.onCancel) {
          await this.onCancel()
        }
      }
    },
    created () {
      this.formConfig = getFormConfig()
      this.formContext = getContext({
        modeString: this.modeString,
        tagList: this.tagList,
        normalAttributes: this.normalAttributes,
        sellAttributes: this.sellAttributes,
        categoryAttrSwitch: true,
        preferences: this.preferences,
        modules: this.modules,
        whiteList: this.whiteList
      })
    }
  }
</script>

<style lang="less">
  .product-form {
    .boo-input-wrapper, .boo-select {
      width: 440px;

      > input {
        height: 36px;
      }

      &.boo-select-multiple .boo-tag {
        height: 28px;
        line-height: 28px;
      }
    }
  }
</style>
