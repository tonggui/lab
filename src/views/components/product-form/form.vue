<template>
  <div>
    <DynamicForm
      class="product-form"
      ref="form"
      :config="formConfig"
      :context="formContext"
      :data="product"
    />
    <FormFooter
      :is-create="isCreateMode"
      @confirm="handleConfirm"
      @cancel="goBack"
    />
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
        default: () => {}
      },
      tagList: Array,
      preferences: {
        type: Object,
        default: () => ({})
      },
      modules: {
        type: Object,
        default: () => ({})
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
      preferences (val) {
        this.formContext.preferences = val || {}
      },
      modules (val) {
        this.formContext.modules = val || {}
      }
    },
    methods: {
      handleConfirm (newValue) {
        this.value = newValue
        if (this.$refs.form) {
          this.$refs.form.validate()
        }
      },
      goBack () {
        window.history.go(-1)
      }
    },
    created () {
      this.formConfig = getFormConfig()
      this.formContext = getContext({
        modeString: this.modeString,
        tagList: this.tagList,
        categoryAttributes: [],
        sellAttributes: [],
        categoryAttrSwitch: true,
        preferences: this.preferences,
        modules: this.modules,
        whiltList: this.whiteList
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
    }
  }
</style>
