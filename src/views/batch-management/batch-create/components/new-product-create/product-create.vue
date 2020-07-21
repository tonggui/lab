<template>
  <OrderFormItem label="填写表格" :index="index + 1">
    <ProductForm
      v-model="product"
      @confirm="handleConfirm"
      hide-cancel
    />
  </OrderFormItem>
</template>
<script>
  import OrderFormItem from '@components/order-form-item'
  import createForm from '@/views/components/configurable-form/instance/common-form'

  const ProductForm = createForm()

  export default {
    name: 'new-batch-product-create',
    props: {
      index: {
        type: Number,
        default: 0
      },
      poiIdList: Array
    },
    components: {
      ProductForm,
      OrderFormItem
    },
    data () {
      return {
        product: {}
      }
    }
  }
</script>
