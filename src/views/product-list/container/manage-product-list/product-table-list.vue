<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh"
      description="商品获取失败～"
    >
      <!-- TODO: 商家商品列表一级包裹 -->
      <ProductTableList
        :disabled="disabled"
        :tag-list="tagList"
        :tag-id="tagId"
        :status="status"
        :status-list="statusList"
        @sort-change="handleSortChange"
        @status-change="handleTabChange"
        :dataSource="list"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        @batch="handleBatchOp"
        @delete="handleDelete"
        @edit="handleModify"
        @edit-sku="handleModifySku"
        @refresh="handleRefresh"
        @close-auto-clear-stock="handleCloseAutoClearStock"
      >
        <div slot="tabs-extra" class="search-wrapper">
          <a @click="handleSearch" v-mc="{ bid: 'b_shangou_online_e_29fcjib2_mc' }" :class="{ disabled }">筛选</a>
          <ProductSearch :disabled="disabled" @search="handleSearch" />
        </div>
        <ProductEmptyContent slot="empty" />
        <template slot="tips">
          <slot name="tips"></slot>
        </template>
      </ProductTableList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '../../components/product-search'
  import searchListPage from '@sgfe/eproduct/navigator/pages/product/searchList'
  import jumpTo from '@components/link/jumpTo'
  import { createNamespacedHelpers } from 'vuex'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import ProductEmptyContent from './product-empty-content'

  const { mapState, mapActions } = createNamespacedHelpers('productList/product')

  export default {
    name: 'product-table-list-container',
    props: {
      tagList: Array,
      disabled: Boolean
    },
    computed: {
      ...mapState([
        'loading',
        'status',
        'statusList',
        'list',
        'pagination',
        'sorter',
        'tagId',
        'error'
      ])
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList),
      ProductSearch,
      ProductEmptyContent
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleSortChange: 'sorterChange',
        handleModify: 'modify',
        handleModifySku: 'modifySku',
        handleRefresh: 'getList',
        handleBatchOp: 'batch',
        handleDelete: 'delete',
        handleCloseAutoClearStock: 'closeAutoClearStock'
      }),
      handleSearch (item = {}) {
        if (this.disabled) {
          return
        }
        jumpTo(searchListPage.pages, {
          params: {
            tagId: item.tagId || '',
            brandId: item.brandId || '',
            keyword: item.name || '',
            wmPoiId: this.$route.query.wmPoiId
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
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }
  }
</style>
