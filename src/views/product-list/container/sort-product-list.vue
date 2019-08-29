<template>
  <SortProductList
    showSmartSort
    :dataSource="list"
    :pagination="pagination"
    :loading="loading"
    @toggle-smart-sort="handleToggleSmartSort"
    @change="handleSort"
    :smartSortSwitch="isSmartSort"
    @page-change="handlePageChange"
  />
</template>
<script>
  import SortProductList from '@/views/components/sort-product-list'
  import { createNamespacedHelpers } from 'vuex'

  const { mapActions, mapState, mapGetters } = createNamespacedHelpers('productList/product')

  export default {
    name: 'sort-product-list-container',
    computed: {
      ...mapState(['loading', 'list', 'pagination']),
      ...mapGetters(['isSmartSort'])
    },
    methods: {
      ...mapActions({
        handleToggleSmartSort: 'toggleSmartSort',
        handlePageChange: 'pageChange'
      }),
      handleSort (...rest) {
        console.log('product sort:', rest)
      }
    },
    components: {
      SortProductList
    }
  }
</script>
