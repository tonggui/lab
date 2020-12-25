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
        @batch="handleBatch"
      >
        <div slot="tabs-extra" class="search-wrapper">
          <a>筛选</a>
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
  import { MEDICINE_PRODUCT_BATCH_OP } from '@/data/enums/product'
  import { batchReplaceProductChangeInfo } from '@/data/api/medicineMerchantApi/product'
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '@/views/merchant/components/product-search'
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
      async batchReplaceProductChangeInfo (params, cb) {
        await batchReplaceProductChangeInfo(params).then((res) => {
          if (!res.code) {
            cb && cb()
          }
        })
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
      },
      handleBatch (op, isAll, idList, cb) {
        switch (op.id) {
        case MEDICINE_PRODUCT_BATCH_OP.CHANGE: {
          const spuIds = idList.map(item => item.spuId)
          this.batchReplaceProductChangeInfo({
            isAll: isAll ? 1 : 0,
            spuIds: !isAll ? spuIds : []
          }, cb)
          break
        }
        default:
          break
        }
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
