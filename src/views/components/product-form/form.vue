<template>
  <div>
    <DynamicForm :config="formConfig" :context="formContext" class="product-form" />
    <FormFooter slot="footer" :is-create="isCreateMode" />
  </div>
</template>

<script>
  import DynamicForm from '@/components/dynamic-form'
  import { getContext } from '@/components/dynamic-form/context'
  import FormCard from './form-card'
  import FormFooter from './form-footer'
  import FormItemLayout from './form-item-layout'

  import ChooseProduct from './components/choose-product'
  import ProductPicture from '@/components/product-picture'
  import TagList from '@/components/taglist'
  import Brand from '@/components/brand'
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
        ProductLabel,
        ProductAttributes,
        TagList,
        Brand,
        SaleTime,
        Input
      }, FormItemLayout)
    },
    props: {
      spuId: [String, Number],
      tagList: Array
    },
    data () {
      return {
        value: 123
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
    methods: {
      handleConfirm (newValue) {
        this.value = newValue
      }
    },
    created () {
      this.formConfig = getFormConfig()
      this.formContext = getContext({
        modeString: this.modeString,
        tagList: this.tagList
      })
    }
  }
</script>

<style lang="less">
  .product-form {
    .boo-input-wrapper {
      width: 440px;
      > input {
        height: 36px;
      }
    }
  }
</style>
