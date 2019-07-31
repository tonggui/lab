<template>
  <div class="sort-list-row">
    <div>
      <ProductInfo :product="product" />
    </div>
    <div>
      <slot name="item"></slot>
    </div>
  </div>
</template>
<script>
  import ProductInfo from '@components/product-table-info'

  export default {
    name: 'sort-product-list-item',
    props: {
      index: Number,
      product: Object
    },
    components: {
      ProductInfo
    }
  }
</script>
<style lang="less" scoped>
  .sort-list-row {
    height: 90px;
    display: table-row;
    background: #fff;
    &:hover {
      background: @hover-bg;
    }
    > div {
      display: table-cell;
      padding-left: 20px;
      padding-right: 20px;
      vertical-align: middle;
    }
  }
</style>
