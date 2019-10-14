<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh"
      description="分类获取失败～"
    >
      <ProductTableList
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
      >
        <div slot="tabs-extra" class="search-wrapper ">
          <a @click="handleSearch" v-mc="{ bid: 'b_shangou_online_e_29fcjib2_mc' }">筛选</a>
          <ProductSearch @search="handleSearch" />
        </div>
        <template slot="empty">
          <div v-if="isNewPoiRecommend">
            <div>快去新建商品吧~</div>
            <div>根据您经营的品类，为您推荐了必建商品可快速新建多个商品！</div>
            <NamedLink :name="hotRecommendPage" tag="a">
              <Button type="primary">新店必建商品</Button>
            </NamedLink>
          </div>
          <span v-else>快去新建商品吧~</span>
        </template>
        <template slot="tips">
          <slot name="tips"></slot>
        </template>
      </ProductTableList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import NamedLink from '@components/link/named-link'
  import hotRecommendPage from '@sgfe/eproduct/navigator/pages/product/hotRecommend'
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '../../components/product-search'
  import { mapActions, mapState } from 'vuex'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  export default {
    name: 'product-table-list-container',
    props: {
      isNewPoiRecommend: Boolean,
      tagList: Array
    },
    computed: {
      ...mapState('productList/product', [
        'loading',
        'status',
        'statusList',
        'list',
        'pagination',
        'sorter',
        'tagId',
        'error'
      ]),
      hotRecommendPage () {
        return hotRecommendPage.name
      }
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList),
      NamedLink,
      ProductSearch
    },
    methods: {
      ...mapActions('productList/product', {
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleSortChange: 'sorterChange',
        handleModify: 'modify',
        handleModifySku: 'modifySku',
        handleRefresh: 'getList'
      }),
      ...mapActions('productList', {
        handleBatchOp: 'batch',
        handleDelete: 'delete'
      }),
      handleSearch (item = {}) {
        this.$router.push({
          name: 'productSearchList',
          query: {
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
    align-items: center;
    padding-top: 15px;
    > a {
      margin-right: 12px;
    }
  }
</style>
