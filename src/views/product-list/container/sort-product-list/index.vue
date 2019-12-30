<template>
  <ProductListPage>
    <SortTagList slot="tag-list" />
    <SortProductList slot="product-list" />
    <StickyFooter
      class="footer"
      slot="footer"
      @on-click="$emit('close-sort')"
      :gap="0"
      :btnTexts="['完成']"
      :btnTypes="['primary']"
      v-mc="{ bid: 'b_shangou_online_e_gpri09nv_mc' }"
    />
  </ProductListPage>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import SortTagList from './sort-tag-list'
  import SortProductList from './sort-product-list'
  import StickyFooter from '@components/sticky-footer'

  export default {
    name: 'sort-product-list-container',
    components: {
      ProductListPage,
      SortTagList,
      SortProductList,
      StickyFooter
    }
  }
</script>
<style lang="less" scoped>
  .footer {
    z-index: 10;
    /deep/ .sticky {
      justify-content: right !important;
    }
  }
</style>
