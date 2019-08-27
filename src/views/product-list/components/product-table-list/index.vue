<template>
  <div>
    <ProductList
      :sorting="sorting"
      :tab-value="status"
      :tabs="statusList"
      :render-tab-label="renderTabLabel"
      :tab-pane-filter="isShowTabPane"
      @tab-change="handleTabChange"
      :batch-operation="batchOperation"
      :batch-operation-filter="isShowBatchOp"
      @batch="handleBatchOp"
      @on-sort-change="handleSortChange"
      :product-list="productList"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :show-header="!sorting"
      @page-change="handlePageChange"
      @change-list="handleChangeList"
      @toggle-smart-sort="handleToggleSmartSort"
      :smart-sort-switch="smartSort"
      show-smart-sort
    >
      <ProductSearch slot="tabs-extra" @search="handleSearch" />
      <template slot="empty">
        <slot name="empty" />
      </template>
    </ProductList>
    <BatchModal
      :loading="batch.loading"
      :value="batch.visible"
      :type="batch.type"
      :count="batch.selectIdList.length"
      @cancel="handleBatchModalCancel"
      @submit="handleBatchModalSubmit"
    />
  </div>
</template>
<script>
  import {
    noop
  } from 'lodash'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import {
    fetchGetProductInfoList,
    fetchSubmitModProduct
  } from '@/data/repos/product'
  import {
    productStatus
  } from '@/data/constants/product'
  import {
    PRODUCT_STATUS,
    PRODUCT_BATCH_OP
  } from '@/data/enums/product'
  import {
    POI_IS_MEDICINE,
    PRODUCT_SELLTIME,
    PRODUCT_LABEL
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'
  import ProductList from '@/views/components/product-list'
  import ProductOperation from './components/product-table-operation'
  import BatchModal from './components/batch-modal'
  import ProductSearch from './components/search'
  import columns from './columns'
  import { batchOperation } from './constants'

  export default {
    name: 'product-list-table-container',
    props: {
      sorting: Boolean,
      tagId: Number,
      smartSortSwitch: Boolean
    },
    mixins: [withModules({
      isMedicine: POI_IS_MEDICINE,
      sellTimeEditable: PRODUCT_SELLTIME,
      labelEditable: PRODUCT_LABEL
    })],
    data () {
      return {
        loading: false,
        error: false,
        sorter: undefined,
        productList: [],
        status: PRODUCT_STATUS.ALL,
        statusList: productStatus,
        pagination: { ...defaultPagination },
        smartSort: this.smartSortSwitch,
        // TODO 批量操作参数存储 看着略恶心
        batch: {
          loading: false,
          type: undefined,
          visible: false,
          selectIdList: [],
          callback: noop
        }
      }
    },
    computed: {
      batchOperation () {
        return batchOperation
      },
      columns () {
        return [...columns, {
          title: '操作',
          width: 200,
          align: 'center',
          render: (h, { row }) => {
            return h(ProductOperation, { props: { product: row } })
          }
        }]
      }
    },
    watch: {
      tagId () {
        this.pagination.current = 1
        this.getData()
      }
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { list, statusList, pagination } = await fetchGetProductInfoList({
            status: this.status,
            tagId: this.tagId,
            sorter: this.sorter
          }, this.pagination, this.statusList)
          this.productList = list
          this.pagination = pagination
          this.statusList = statusList
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      renderTabLabel (h, item) {
        const { name, count, needDanger = false } = item
        return (
          <div>{name} <span class={needDanger ? 'danger' : ''}>{count}</span></div>
        )
      },
      isShowTabPane (item) {
        if (item.id === PRODUCT_STATUS.INCOMPLETE) {
          return this.isMedicine
        }
        return true
      },
      isShowBatchOp (op) {
        if (op.id === PRODUCT_BATCH_OP.MOD_TIME) {
          return this.sellTimeEditable
        }
        if (op.id === PRODUCT_BATCH_OP.MOD_LABEL) {
          return this.labelEditable
        }
        return true
      },
      handleToggleSmartSort (value) {
        this.smartSort = value
      },
      handleChangeList (list) {
        this.productList = list
      },
      handleSearch (item) {
        this.$router.push({
          name: 'searchList',
          query: {
            tagId: item.tagId,
            brandId: item.id,
            keyword: item.name
          }
        })
      },
      handlePageChange (pagination) {
        this.pagination = pagination
        this.getData()
      },
      handleTabChange (status) {
        this.status = status
        this.getData()
      },
      handleBatchOp (type, idList, cb) {
        this.batch.type = type
        this.batch.selectIdList = idList
        this.batch.visible = true
        this.batch.callback = cb || noop
      },
      handleSortChange ({ column, key, order } = {}) {
        this.sorter = {
          [key]: order
        }
        this.getData()
      },
      handleBatchModalCancel () {
        this.batch.visible = false
      },
      async handleBatchModalSubmit (data) {
        try {
          const skuIdList = []
          this.batch.selectIdList.forEach((id) => {
            const product = this.productList.find(item => item.id === id)
            if (product) {
              product.skuList.forEach(sku => skuIdList.push(sku.id))
            }
          })
          this.batch.loading = true
          await fetchSubmitModProduct(this.batch.type, data, {
            tagId: this.tagId,
            spuIdList: this.batch.selectIdList,
            skuIdList,
            productStatus: this.status
          })
          this.batch.loading = false
          this.batch.visible = false
          this.batch.callback()
          this.getData()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        }
      }
    },
    components: {
      ProductList,
      ProductSearch,
      BatchModal
    },
    mounted () {
      this.getData()
    }
  }
</script>
