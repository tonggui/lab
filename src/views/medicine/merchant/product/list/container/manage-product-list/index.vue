<template>
  <ProductListPage>
    <ManageTagList slot="tag-list" @open-sort="$emit('open-sort')" />
    <ManageProductList slot="product-list" />
  </ProductListPage>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ManageTagList from './manage-tag-list'
  import ManageProductList from './manage-product-list'

  export default {
    name: 'merchant-product-manage-list-container',
    components: {
      ProductListPage,
      ManageTagList,
      ManageProductList
    }
  }
</script>
