<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh"
      description="商品获取失败～"
    >
      <ProductTableList
        :tag-id="tagId"
        :status="status"
        :status-list="statusList"
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
        <div slot="tabs-extra" class="search-wrapper">
          <ProductSearch @search="handleSearch" />
        </div>
        <template slot="empty">
          <span>快去新建商品吧~</span>
        </template>
      </ProductTableList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '../../components/product-search'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapState, mapActions } = helper('product')

  export default {
    name: 'merchant-product-manage-product-list-container',
    computed: {
      ...mapState([
        'status',
        'statusList',
        'loading',
        'list',
        'pagination',
        'tagId',
        'error'
      ])
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList),
      ProductSearch
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleModify: 'modify',
        handleModifySku: 'modifySkuList',
        handleRefresh: 'getList',
        handleDelete: 'delete'
      }),
      handleSearch (item = {}) {
        this.$router.push('/merchant/product/searchList', {
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
