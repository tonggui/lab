<template>
  <OrderFormItem label="填写表格" :index="index + 1">
    <ProductForm :modules="modules" />
  </OrderFormItem>
</template>
<script>
  import OrderFormItem from '@components/order-form-item'
  import ProductForm from '@/views/components/product-form/form'
  export default {
    name: 'batch-product-create',
    props: {
      index: {
        type: Number,
        default: 0
      },
      poiIdList: Array,
      modules: Object
    },
    components: {
      OrderFormItem,
      ProductForm
    }
  }
</script>
