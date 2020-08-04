<template>
  <OrderFormItem label="选择商品">
    <div class="product-selector-container">
      <div class="product-selector-label">选择商品</div>
      <ProductSelector
        class="product-selector-content"
      />
    </div>
  </OrderFormItem>
</template>

<script>
  import OrderFormItem from '@components/order-form-item'
  import ProductSelector from '@/views/merchant/batch-management/batch-rel/components/product-selector-with-taglist'

  export default {
    name: 'ProductRel',
    components: {
      OrderFormItem,
      ProductSelector
    }
  }
</script>

<style lang="less" scoped>
.product-selector-container {
  display: flex;
  align-items: center;
  .product-selector-label {
    width: 60px;
  }
  .product-selector-content {
    margin-left: 10px;
  }
}
</style>
