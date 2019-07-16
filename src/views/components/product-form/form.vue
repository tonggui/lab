<template>
  <div>
    <DynamicForm
      class="product-form"
      ref="form"
      :config="formConfig"
      :context="formContext"
      :data="value"
    />
    <FormFooter
      slot="footer"
      :is-create="isCreateMode"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
  import DynamicForm from '@/components/dynamic-form'
  import { getContext } from '@/components/dynamic-form/context'
  import FormCard from './form-card'
  import FormFooter from './form-footer'
  import FormItemLayout from './form-item-layout'
  import { PRODUCT_TAG_COUNT } from '@/common/cmm/modules'
  import withModules from '@/mixins/withModules'

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

  import getFormConfig from './config'
  export default {
    name: 'product-form',
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
        Input
      }, FormItemLayout)
    },
    mixins: [
      withModules({ PRODUCT_TAG_COUNT })
    ],
    props: {
      spuId: [String, Number],
      tagList: Array
    },
    data () {
      return {
        value: {
        }
      }
    },
    computed: {
      isCreateMode () {
        return !this.spuId
      },
      modeString () {
        return this.isCreateMode ? '修改' : '新建'
      }
    },
    watch: {
      PRODUCT_TAG_COUNT (val = 1) {
        this.formContext.maxTagCount = val
      }
    },
    methods: {
      handleConfirm (newValue) {
        this.value = newValue
        if (this.$refs.form) {
          this.$refs.form.validate()
        }
      }
    },
    created () {
      this.formConfig = getFormConfig()
      this.formContext = getContext({
        modeString: this.modeString,
        tagList: this.tagList,
        maxTagCount: this.PRODUCT_TAG_COUNT || 1,
        categoryAttributes: [],
        sellAttributes: []
      })
    }
  }
</script>

<style lang="less">
  .product-form {
    .boo-input-wrapper
    , .boo-select {
      width: 440px;
      > input {
        height: 36px;
      }
    }
  }
</style>
