<template>
  <SortProductList
    :show-smart-sort="false"
    :dataSource="list"
    :pagination="pagination"
    :loading="loading"
    @change="handleSort"
    @page-change="handlePageChange"
  />
</template>
<script>
  import SortProductList from '@/views/components/sort-product-list'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapActions, mapState } = helper('product')

  export default {
    name: 'merchant-product-sort-product-list-container',
    computed: {
      ...mapState(['loading', 'list', 'pagination'])
    },
    methods: {
      ...mapActions({
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
