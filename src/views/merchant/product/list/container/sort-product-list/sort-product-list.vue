<template>
  <ErrorBoundary
    :error="error"
    :top="200"
    @refresh="handleRefresh"
    description="商品获取失败～"
  >
    <SortProductList
      :show-smart-sort="false"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      :productMarkerFilter="productMarkerFilter"
      @change="handleSort"
      @page-change="handlePageChange"
    />
  </ErrorBoundary>
</template>
<script>
  import SortProductList from '@/views/components/sort-product-list'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapActions, mapState } = helper('product')

  export default {
    name: 'merchant-product-sort-product-list-container',
    computed: {
      ...mapState(['loading', 'list', 'pagination', 'error'])
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        sort: 'sort',
        handleRefresh: 'getList'
      }),
      handleSort (productList, product, sortOptions) {
        return this.sort({ productList, product, sortOptions })
      },
      productMarkerFilter (product) {
        return product.isMerchantDelete
      }
    },
    components: {
      SortProductList: withPromiseEmit(SortProductList)
    }
  }
</script>
