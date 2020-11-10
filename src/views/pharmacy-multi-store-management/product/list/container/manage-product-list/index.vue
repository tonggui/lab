<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh(searchParamsBefore)"
      description="商品获取失败～"
    >
      <ProductTableList
        :tag-id="tagId"
        :status="status"
        @status-change="handleTabChange"
        :dataSource="list"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        @delete="handleDelete"
        @edit="handleModify"
        @edit-sku="handleModifySku"
        @refresh="handleRefresh"
      >
        <!-- <div slot="tabs-extra" class="search-wrapper">
          <ProductSearch @search="handleSearch" />
        </div> -->
        <template slot="empty">
          <span>暂无商品~</span>
        </template>
      </ProductTableList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import ProductTableList from '../../components/product-table-list'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapState, mapActions } = helper('product')

  export default {
    name: 'multi-store-product-manage-product-list-container',
    computed: {
      ...mapState([
        'status',
        'loading',
        'list',
        'pagination',
        'tagId',
        'error',
        'searchParamsBefore'
      ])
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList)
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleModify: 'modify',
        handleModifySku: 'modifySku',
        handleRefresh: 'getList',
        handleDelete: 'delete'
      }),
      handleSearch (item = {}) {
        this.$router.push({
          path: '/merchant/product/searchList',
          query: {
            tagId: item.tagId || '',
            brandId: item.brandId || '',
            keyword: item.name || '',
            dataType: item.type || ''
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .search-wrapper {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    height: 61px;
    > a {
      margin-right: 12px;
    }
  }
</style>
