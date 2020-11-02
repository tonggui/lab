<template>
  <div>
      <Columns
        @delete="handleDelete"
        @edit-product="handleEdit"
        @edit-sku="handleEditSku"
      >
      <template v-slot:default="{columns}">
        <ProductTableList
          show-header
          :tab-value="status"
          :tabs="statusList"
          :batch-operation="batchOperation"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="handlePageChange"
          @tab-change="handleStatusChange"
          @batch="handleBatchOp"
          class="product-table-list"
        >
          <!-- <template slot="tabs-extra">
            <slot name="tabs-extra"></slot>
          </template> -->
          <template slot="empty">
            <slot name="empty" />
          </template>
        </ProductTableList>
      </template>
    </Columns>
    <ModifyModal
      :loading="batch.loading"
      :value="batch.op.key && batch.visible"
      :product="list"
      :op="batch.op"
      :count="batch.count"
      @cancel="handleBatchModalCancel"
      @submit="handleBatchModalSubmit"
    />
    <Modal
      :width="400"
      :value="!batch.op.key && batch.visible"
      :loading="batch.loading"
      @on-cancel="handleBatchModalCancel"
      @on-ok="handleBatchModalSubmit"
    >
      {{batchModalContent}}
    </Modal>
  </div>
  <!-- :type="batch.type"
        :count="batch.selectIdList.length" -->
</template>
<script>
  import { noop } from 'lodash'
  import ProductTableList from './components/list-table'
  import Columns from './components/columns'
  import ModifyModal from './components/modify-modal'
  import lx from '@/common/lx/lxReport'
  import { createCallback } from '@/common/vuex'
  import localStorage, { KEYS } from '@/common/local-storage'
  import {
    BATCH_OPARATION_ENUM
  } from '@/data/enums/multiStore'
  import {
    multiStoreProductDelete,
    multiStoreProductModifyShelf,
    multiStoreProductModifyPrice,
    multiStoreProductModifyStock
  } from '@/data/api/medicineMultiStore'
  import { batchOperation } from './constants'
  import { helper } from '../../store'
  import { Message } from '@roo-design/roo-vue'

  const { mapState } = helper('product')

  export default {
    name: 'product-list-table-container',
    props: {
      dataSource: Array,
      pagination: Object,
      loading: Boolean,
      statusList: [Array, Boolean],
      status: [Number, String],
      createCallback: {
        type: Function,
        default: createCallback
      },
      showTabItemNumber: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        batch: {
          loading: false,
          // type: undefined,
          visible: false,
          chooseAll: 0,
          selectIdList: [],
          callback: noop,
          // tip: {},
          op: {},
          count: 0
        }
      }
    },
    computed: {
      ...mapState([
        'list',
        'searchParams'
      ]),
      batchOperation () {
        return batchOperation
      },
      batchModalContent () {
        if (!this.isColumn) {
          const { name } = this.batch.op
          return `共选中758个门店商品${name}`
        }
        return ''
      },
      isColumn () {
        const { type } = this.batch.op
        return type === BATCH_OPARATION_ENUM.MOD_PRICE || type === BATCH_OPARATION_ENUM.MOD_STOCK
      }
    },
    methods: {
      handleDelete (product, params) {
        // params -> { wmPoiId, skuId }
        console.log(params)
        return new Promise((resolve, reject) => {
          this.$emit('delete', { product, params }, this.createCallback(resolve, reject))
        })
      },
      handleEdit (product, params) {
        return new Promise((resolve, reject) => {
          this.$emit('edit', { product, params }, this.createCallback(resolve, reject))
        })
      },
      // handleEditSku (product, skuList, type, params) {
      //   return new Promise((resolve, reject) => {
      //     this.$emit('edit-sku', { product, skuList, type, params }, this.createCallback(resolve, reject))
      //   })
      // },
      handleEditSku (product, type, params, callback) {
        this.$emit('edit-sku', { product, type, params }, callback)
      },
      handleStatusChange (status) {
        this.$emit('status-change', status)
      },
      handlePageChange (pagination) {
        if (pagination.pageSize !== this.pagination.pageSize) {
          lx.mc({ bid: 'b_shangou_online_e_m0lr7zoj_mc', val: { type: pagination.pageSize } })
          localStorage[KEYS.MERCHANT_PRODUCT_LIST] = pagination.pageSize
        }
        this.$emit('page-change', pagination)
      },
      handleBatchOp (op, chooseAll, idList, cb) {
        console.log(chooseAll, idList)
        this.batch.op = op
        this.batch.loading = false
        this.batch.chooseAll = chooseAll
        this.batch.selectIdList = idList
        // this.batch.visible = true
        this.batch.callback = cb || noop
        this.batch.count = chooseAll ? this.pagination.total : idList.length
        // 调价
        const { isColumn } = this
        if (!isColumn) {
          this.batch.visible = true
        } else if (this.searchParams.upcCode) {
          console.log('count: ', this.pagination.total, idList.length)
          // 说明上查询有upc编码，打开modal
          this.batch.visible = true
          // console.log(2222)
        } else {
          this.$Message.warning('请输入UPC编码并查询')
        }
      },
      handleBatchModalCancel () {
        this.batch.visible = false
      },
      handlemultiStoreProductModifyShelf (params) {
        multiStoreProductModifyShelf(params).then(() => {
          Message.success(this.batch.tip.success)
        }).catch(() => {
          Message.error(this.batch.tip.error)
        })
      },

      async handleBatchModalSubmit (data, force = false) {
        this.batch.loading = true
        const { chooseAll, selectIdList } = this.batch
        // console.log(selectIdList)
        let params = { chooseAll }
        if (!chooseAll) {
          params.poiSkus = [...selectIdList]
          console.log(params.poiSkus)
        } else {
          params = { ...params, ...this.searchParams }
        }
        switch (this.batch.op.type) {
        case BATCH_OPARATION_ENUM.DELETE:
          await multiStoreProductDelete(params).then(() => {
            Message.success(this.batch.tip.success)
          }).catch(() => {
            Message.error(this.batch.tip.error)
          })
          break
        case BATCH_OPARATION_ENUM.PUT_ON:
          params.targetSellStatus = 0
          await this.handlemultiStoreProductModifyShelf(params)
          break
        case BATCH_OPARATION_ENUM.PUT_OFF:
          params.targetSellStatus = 1
          await this.handlemultiStoreProductModifyShelf(params)
          break
        case BATCH_OPARATION_ENUM.MOD_PRICE:
          params.targetPrice = data
          await multiStoreProductModifyPrice(params).then(() => {
            Message.success('调价成功～')
          }).catch((err) => {
            if ((err.code === 1 || err.code === -1) && err.message) {
              Message.error(err.message)
            }
          })
          break
        case BATCH_OPARATION_ENUM.MOD_STOCK:
          params.targetStock = data
          await multiStoreProductModifyStock(params).then(() => {
            Message.success('批量修改库存成功～')
          }).catch((err) => {
            if ((err.code === 1 || err.code === -1) && err.message) {
              Message.error(err.message)
            }
          })
          break
        default:
          break
        }
        this.batch.loading = false
        this.batch.visible = false
      }
    },
    components: {
      Columns,
      ProductTableList,
      ModifyModal
    }
  }
</script>
<style scoped lang="less">
  .product-table-list {
    /deep/ .boo-table-row {
      .edit-icon {
        visibility: hidden;
        &.disabled {
          color: @disabled-color !important;
          cursor: not-allowed;
        }
      }
      &:hover .edit-icon {
        visibility: visible;
      }
    }
    /deep/ .product-list-table-body {
      .boo-table-cell {
        padding: 8px 10px;
        &.boo-table-cell-with-selection{
          padding: 8px 0 8px 20px;
        }
      }
    }
  }
</style>
