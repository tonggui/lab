<template>
  <div>
    <ProductTableList
      :tag-list="tagList"
      :tag-id="tagId"
      :status-list="statusList"
      :status="status"
      @status-change="handleStatusChange"
      @sort-change="handleSortChange"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @batch="handleBatchOp"
      @delete="handleDelete"
      @edit="handleModify"
      @edit-sku="handleModifySku"
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
    props: {
      tagList: Array
    },
    computed: {
      ...mapState(['loading', 'status', 'statusList', 'list', 'pagination', 'sorter', 'tagId'])
    },
    components: {
      ProductTableList
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleSortChange: 'sortChange',
        handleStatusChange: 'statusChange',
        batch: 'batch',
        handleDelete: 'delete',
        handleModify: 'modify',
        handleModifySku: 'modifySku'
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
