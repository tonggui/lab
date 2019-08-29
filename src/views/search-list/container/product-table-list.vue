<template>
  <div>
    <ProductTableList
      :status="status"
      :statusList="statusList"
      @sort-change="handleSortChange"
      @status-change="handleTabChange"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @batch="handleBatchOp"
    >
      <template slot="empty">
        <span>没有搜索结果，换个词试试吧!</span>
      </template>
    </ProductTableList>
  </div>
</template>
<script>
  import ProductTableList from '@/views/product-list/components/product-table-list'
  import { createNamespacedHelpers } from 'vuex'

  const { mapActions, mapState } = createNamespacedHelpers('searchList/product')

  export default {
    name: 'search-list-product-table-list-container',
    computed: {
      ...mapState(['loading', 'status', 'statusList', 'list', 'pagination', 'sorter'])
    },
    components: {
      ProductTableList
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleSortChange: 'sortChange',
        batch: 'batch'
      }),
      async handleBatchOp ({ type, data, idList }, cb) {
        try {
          await this.batch({ type, data, idList })
          cb && cb()
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
