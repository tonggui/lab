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
        :tag-list="tagList"
        @page-change="handlePageChange"
        @delete="handleDelete"
        @edit="handleModify"
        @edit-sku="handleModifySku"
        @refresh="handleRefresh"
        @batch="handleBatchOperation"
      >
        <div slot="tabs-extra" class="search-wrapper">
          <ProductSearch @search="handleSearch" />
        </div>
        <div class="empty-product-list" slot="empty">
          <h3>暂无商品</h3>
          <p>请使用<a @click="handleBatchCreate">批量新建</a>上传Excel一次性创建多个商品</p>
          <p>或使用<a @click="handleSingleCreate">新建单个商品</a>逐个创建</p>
          <p>或<a @click.prevent>【魔方快捷新建】</a>创建商品</p>
        </div>
<!--        <template slot="empty">-->
<!--          <span>快去新建商品吧~</span>-->
<!--        </template>-->
      </ProductTableList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '@/views/merchant/components/product-search'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import { KEYS } from '@/views/merchant/batch-management/menus'
  import { triggerProductOperation } from '../../merchant-tour'

  const { mapState, mapActions } = helper('product')
  const { mapGetters } = helper()

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
      ]),
      ...mapGetters(['tagList'])
    },
    watch: {
      list (val) {
        if (val && val.length) {
          triggerProductOperation()
        }
      }
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
        handleDelete: 'delete',
        handleBatchOperation: 'batch'
      }),
      handleBatchCreate () {
        this.$router.push({ name: KEYS.CREATE })
      },
      handleSingleCreate () {
        this.$router.push({ name: 'merchantEdit' })
      },
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
  .empty-product-list {
    //display: flex;
    //flex-direction: column;
    //align-items: center;
    //justify-content: center;
    //min-height: 600px;
  }
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
