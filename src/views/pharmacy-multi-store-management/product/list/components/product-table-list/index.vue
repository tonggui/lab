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
        :value="batch.visible"
        :product="list"
        :op="batch.op"
        :count="batch.count"
        @cancel="handleBatchModalCancel"
        @submit="handleBatchModalSubmit"
      />
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
    PACKAGE_PRODUCT_OPT_STATUS,
    PRODUCT_BATCH_OP
  } from '@/data/enums/product'
  import {
    BATCH_OPARATION_ENUM
  } from '@/data/enums/multiStore'
  import { batchOperation } from './constants'
  import { helper } from '../../store'
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
      }
    },
    methods: {
      handleDelete (product, params) {
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
      handleEditSku (product, sku, params, callback) {
        this.$emit('edit-sku', { product, sku, params }, callback)
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
        if (op.type !== BATCH_OPARATION_ENUM.MOD_PRICE && op.type !== BATCH_OPARATION_ENUM.MOD_STOCK) {
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
      async handleBatchModalSubmit (data, force = false) {
        this.batch.loading = true
        const tip = this.batch.tip || {}
        this.$emit('batch', {
          type: this.batch.type,
          data,
          force,
          idList: this.batch.selectIdList
        }, this.createCallback((data) => {
          this.batch.loading = false
          this.batch.visible = false
          this.batch.callback()
          if (data && data.needTip) {
            const { type, message } = data.tip
            this.$Message[type](message)
          } else {
            this.$Message.success(tip.success)
          }
        }, (err) => {
          this.batch.loading = false
          if ([PACKAGE_PRODUCT_OPT_STATUS.SELL_STATUS_OFF_CONFIRM, PACKAGE_PRODUCT_OPT_STATUS.DELETE_CONFIRM].includes(err.code)) {
            this.$Modal.confirm({
              title: '提示',
              content: err.message,
              okText: '确定',
              onOk: () => this.handleBatchModalSubmit(data, true)
            })
            return
          }
          // 删除库存提示
          if (err.code === PACKAGE_PRODUCT_OPT_STATUS.UPDATE_STOCK_TIP) {
            this.$Modal.info({
              title: '提示',
              content: err.message
            })
            return
          }
          // 组包商品上架确认提示
          if (err.code === PACKAGE_PRODUCT_OPT_STATUS.SELL_STATUS_ON_CONFIRM) {
            this.$Modal.confirm({
              title: '组包商品关联未上架商品明细信息',
              width: 600,
              render: () => (
                <PackageProductUnitTable
                  width={560}
                  source={err.data}
                />
              ),
              centerLayout: true,
              okText: '全部上架',
              onOk: () => this.handleBatchModalSubmit(data, true)
            })
            return
          }
          // 批量上架出错了 直接弹框
          if (this.batch.type === PRODUCT_BATCH_OP.PUT_ON && err.message) {
            this.batch.visible = false
            this.batch.callback()
            this.$Modal.info({ content: err.message, title: '提示' })
            return
          }
          this.$Message.error(err.message || tip.error)
        }))
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
