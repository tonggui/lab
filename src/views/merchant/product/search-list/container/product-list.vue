<template>
  <ErrorBoundary
    :error="error"
    @refresh="handleRefresh"
    description="搜索商品获取失败～"
  >
    <ProductTableList
      :tag-id="tagId"
      :status-list="false"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @delete="handleDelete"
      @edit="handleModify"
      @edit-sku="handleModifySku"
    >
      <template slot="empty">
        <span v-if="!loading">没有搜索结果，换个词试试吧!</span>
      </template>
    </ProductTableList>
  </ErrorBoundary>
</template>
<script>
  // 直接复用列表页 的 ProductTableList
  import ProductTableList from '@/views/merchant/product/list/components/product-table-list'

  import { helper } from '../store'

  const { mapActions, mapState } = helper('product')

  export default {
    name: 'merchant-search-list-product-container',
    computed: {
      ...mapState(['error', 'loading', 'list', 'pagination', 'tagId'])
    },
    components: {
      ProductTableList
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleDelete: 'delete',
        handleModify: 'modify',
        handleModifySku: 'modifySkuList',
        handleRefresh: 'getList'
      })
    }
  }
</script>
