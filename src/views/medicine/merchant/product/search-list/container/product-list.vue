<template>
  <ErrorBoundary
    :error="error"
    :top="200"
    @refresh="handleRefresh"
    description="搜索商品获取失败～"
  >
    <ProductTableList
      :tag-id="tagId"
      :showSelectAll="false"
      :status-list="false"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      :defaultBatchOperation="batchOperation"
      @page-change="handlePageChange"
      @delete="handleDelete"
      @edit="handleModify"
      @edit-sku="handleModifySku"
      @refresh="handleRefresh"
      @batch="handleBatch"
    >
      <template slot="empty">
        <span v-if="!loading">没有搜索结果，换个词试试吧!</span>
      </template>
    </ProductTableList>
    <BatchModal
      :tag-list="tagList"
      :loading="batch.loading"
      :value="batch.visible"
      :type="batch.type"
      :count="batch.selectIdList.length"
      @cancel="handleBatchModalCancel"
      @submit="handleBatchModalSubmit"
    />
  </ErrorBoundary>
</template>
<script>
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  // 直接复用列表页 的 ProductTableList
  import ProductTableList from '@/views/medicine/merchant/product/list/components/product-table-list'
  import BatchModal from '@/views/product-list/components/product-table-list/components/batch-modal'
  import { batchOperation } from './constants'
  import { helper } from '../store'
  import { PRODUCT_BATCH_OP } from '@/data/enums/product'
  import { fetchSubmitModProductSellStatus } from '@/data/repos/medicineMerchantProduct'

  const { mapActions, mapState } = helper('product')

  export default {
    name: 'merchant-search-list-product-container',
    props: {
      tagList: Array
    },
    data () {
      return {
        batchOperation,
        batch: {
          loading: false,
          type: undefined,
          visible: false,
          selectIdList: [],
          // callback: noop,
          tip: {}
        }
      }
    },
    computed: {
      ...mapState(['error', 'loading', 'list', 'pagination', 'tagId'])
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList),
      BatchModal
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleDelete: 'delete',
        handleModify: 'modify',
        handleModifySku: 'modifySkuList',
        handleRefresh: 'getList'
      }),
      handleBatch ({ id, tip }, isAll, idList, cb) {
        this.batch.type = id
        this.batch.selectIdList = idList.map(item => item.spuId)
        this.batch.visible = true
        // this.batch.callback = cb || noop
        this.batch.tip = tip || {}
      },
      handleBatchModalCancel () {
        this.batch.visible = false
      },
      async handleBatchModalSubmit () {
        const { type, selectIdList, tip } = this.batch
        this.batch.loading = true
        /* eslint-disable */
        try {
          switch (type) {
            case PRODUCT_BATCH_OP.PUT_ON:
              // 批量上架
              await fetchSubmitModProductSellStatus(selectIdList, 0)
              break
            case PRODUCT_BATCH_OP.PUT_OFF:
              // 批量下架
              await fetchSubmitModProductSellStatus(selectIdList, 1)
              break
          }
          this.batch.visible = false
          this.$Message.success(tip.success)
        } catch (e) {
          this.$Message.error(e.message || tip.error)
        } finally {
          this.batch.loading = false
        }
      }
    }
  }
</script>
