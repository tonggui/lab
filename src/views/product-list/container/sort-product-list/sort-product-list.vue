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
    need-permission
  />
</template>
<script>
  import SortProductList from '@/views/components/sort-product-list'
  import { createNamespacedHelpers } from 'vuex'
  import {
    PRODUCT_SMART_SORT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapActions, mapState, mapGetters } = createNamespacedHelpers('productList/product')

  export default {
    name: 'sort-product-list-container',
    computed: {
      ...mapModule({ showSmartSort: PRODUCT_SMART_SORT }),
      ...mapState(['loading', 'list', 'pagination']),
      ...mapGetters(['isSmartSort'])
    },
    methods: {
      ...mapActions({
        handleToggleSmartSort: 'toggleSmartSort',
        handlePageChange: 'pageChange',
        sort: 'sort'
      }),
      handleSort (productList, product, sortOptions) {
        return this.sort({ productList, product, sortOptions })
      }
    },
    components: {
      SortProductList: withPromiseEmit(SortProductList)
    }
  }
</script>
