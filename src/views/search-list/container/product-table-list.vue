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
      :show-tab-item-number="false"
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
  import { mapActions, mapState } from 'vuex'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  export default {
    name: 'search-list-product-table-list-container',
    props: {
      tagList: Array
    },
    computed: {
      ...mapState('searchList/product', ['loading', 'status', 'statusList', 'list', 'pagination', 'sorter', 'tagId']),
      ...mapState('searchList/product', {
        statusList: (state) => state.statusList.length > 0 ? state.statusList : false
      })
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList)
    },
    methods: {
      ...mapActions('searchList/product', {
        handlePageChange: 'pageChange',
        handleSortChange: 'sortChange',
        handleStatusChange: 'statusChange',
        handleModify: 'modify',
        handleModifySku: 'modifySku'
      }),
      ...mapActions('searchList', {
        batch: 'batch',
        handleDelete: 'delete'
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
