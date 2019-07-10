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
  import ChooseProduct from './components/choose-product'
  import ProductPicture from '@/components/product-picture'
  import Input from './components/Input'
  import getFormConfig from './config'
  export default {
    name: 'product-form',
    components: {
      FormFooter,
      DynamicForm: DynamicForm({
        FormCard,
        ChooseProduct,
        ProductPicture,
        Input
      })
    },
    props: {
      spuId: [String, Number]
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
        modeString: this.modeString
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
