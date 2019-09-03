<template>
  <SortProductList
    :show-smart-sort="showSmartSort"
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
  import {
    SWITCH_PRODUCT_SMART_SORT
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  const { mapActions, mapState, mapGetters } = createNamespacedHelpers('productList/product')

  export default {
    name: 'sort-product-list-container',
    mixins: [withModules({ showSmartSort: SWITCH_PRODUCT_SMART_SORT })],
    computed: {
      ...mapState(['loading', 'list', 'pagination']),
      ...mapGetters(['isSmartSort'])
    },
    methods: {
      ...mapActions({
        handleToggleSmartSort: 'toggleSmartSort',
        handlePageChange: 'pageChange',
        sort: 'sort'
      }),
      handleSort (productList, product) {
        this.sort({ productList, product })
      }
    },
    components: {
      SortProductList
    }
  }
</script>
