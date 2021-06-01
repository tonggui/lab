<template>
  <ErrorBoundary
    :error="error"
    :top="200"
    @refresh="handleRefresh"
    description="搜索商品获取失败～"
  >
    <ProductTableList
      :tag-id="tagId"
      :status-list="false"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      :tag-list="tagList"
      @page-change="handlePageChange"
      @delete="handleDelete"
      @edit="handleModify"
      @edit-sku="handleModifySku"
      @refresh="handleRefresh"
      @batch="handleBatchOperation"
    >
      <template slot="empty">
        <span v-if="!loading">没有搜索结果，换个词试试吧!</span>
      </template>
    </ProductTableList>
  </ErrorBoundary>
</template>
<script>
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  // 直接复用列表页 的 ProductTableList
  import ProductTableList from '@/views/merchant/product/list/components/product-table-list'

  import { helper } from '../store'

  const { mapActions, mapState } = helper('product')
  const { mapGetters } = helper('tag')

  export default {
    name: 'merchant-search-list-product-container',
    computed: {
      ...mapState(['error', 'loading', 'list', 'pagination', 'tagId']),
      ...mapGetters({
        tagList: 'fullTagList'
      })
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList)
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleDelete: 'delete',
        handleModify: 'modify',
        handleModifySku: 'modifySkuList',
        handleRefresh: 'getList',
        handleBatchOperation: 'batch'
      })
    }
  }
</script>
