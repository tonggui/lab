<template>
  <div>
    <Columns
      :tagId="tagId"
      @delete="handleDelete"
      @edit-product="handleEdit"
      @edit-sku="handleEditSku"
      @refresh="$emit('refresh')"
    >
      <template v-slot:default="{columns}">
        <ProductTableList
          show-header
          :tab-value="status"
          :tabs="statusList"
          :render-tab-label="renderTabLabel"
          :tab-pane-filter="isShowTabPane"
          @on-sort-change="handleSortChange"
          @tab-change="handleStatusChange"
          :batch-operation="batchOperation"
          :batch-operation-filter="isShowBatchOp"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="handlePageChange"
          @batch="handleBatchOp"
          @select-all="handleSelectAll"
          class="product-table-list"
        >
          <template slot="tabs-extra">
            <slot name="tabs-extra"></slot>
          </template>
          <template slot="empty">
            <slot name="empty" />
          </template>
          <template slot="tips">
            <slot name="tips" />
          </template>
        </ProductTableList>
      </template>
    </Columns>
    <BatchModal
      :tag-list="tagList"
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
    PRODUCT_STATUS,
    PRODUCT_BATCH_OP
  } from '@/data/enums/product'
  import {
    PRODUCT_SELL_TIME,
    PRODUCT_LABEL,
    PRODUCT_INCOMPLETE_TAB
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import ProductTableList from '@components/product-list-table'
  import BatchModal from './components/batch-modal'
  import Columns from './components/columns'
  import { batchOperation } from './constants'
  import lx from '@/common/lx/lxReport'
  import { createCallback } from '@/common/vuex'

  export default {
    name: 'product-list-table-container',
    props: {
      tagId: Number,
      tagList: Array,
      status: [Number, String],
      statusList: Array,
      dataSource: Array,
      pagination: Object,
      loading: Boolean,
      createCallback: {
        type: Function,
        default: createCallback
      }
    },
    data () {
      return {
        batch: {
          loading: false,
          type: undefined,
          visible: false,
          selectIdList: [],
          callback: noop,
          tip: {}
        }
      }
    },
    computed: {
      ...mapModule({
        sellTimeEditable: PRODUCT_SELL_TIME,
        labelEditable: PRODUCT_LABEL,
        showIncompleteTab: PRODUCT_INCOMPLETE_TAB
      }),
      batchOperation () {
        return batchOperation
      }
    },
    methods: {
      renderTabLabel (h, item) {
        const { name, count, needDanger = false, id } = item
        return (
          <div vMc={{ bid: 'b_hc05e0n2', val: { type: +id + 1 } }}>{name} <span class={needDanger && count > 0 ? 'danger' : ''}>{count}</span></div>
        )
      },
      isShowTabPane (item) {
        if (item.id === PRODUCT_STATUS.INCOMPLETE) {
          return this.showIncompleteTab
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
      handleSelectAll (status) {
        lx.mc({ bid: 'b_khdinlf9', val: { status: status ? 1 : 0 } })
      },
      handleDelete (product, isCurrentTag = false, callback) {
        this.$emit('delete', { product, isCurrentTag }, callback)
      },
      handleEdit (product, params, callback) {
        this.$emit('edit', { product, params }, callback)
      },
      handleEditSku (product, sku, params, callback) {
        this.$emit('edit-sku', { product, sku, params }, callback)
      },
      handleBatchOp ({ id, tip }, idList, cb) {
        this.batch.type = id
        this.batch.selectIdList = idList
        this.batch.visible = true
        this.batch.callback = cb || noop
        this.batch.tip = tip || {}
      },
      handlePageChange (page) {
        if (page.pageSize !== this.pagination.pageSize) {
          lx.mc({ bid: 'b_shangou_online_e_m0lr7zoj_mc', val: { type: page.pageSize } })
        } else if (page.current !== this.pagination.current) {
          lx.mc({ bid: 'b_shangou_online_e_ly6k5fba_mc' })
        }
        this.$emit('page-change', page)
      },
      handleStatusChange (status) {
        this.$emit('status-change', status)
      },
      handleSortChange ({ column, key, order } = {}) {
        const sorter = {
          [key]: order
        }
        lx.mc({
          bid: 'b_shangou_online_e_iy0b2bu7_mc',
          val: {
            title: column.title,
            sort_type: order === 'asc' ? 1 : 2
          }
        })
        this.$emit('sort-change', sorter)
      },
      handleBatchModalCancel () {
        this.batch.visible = false
      },
      async handleBatchModalSubmit (data) {
        this.batch.loading = true
        const tip = this.batch.tip || {}
        this.$emit('batch', {
          type: this.batch.type,
          data,
          idList: this.batch.selectIdList
        }, this.createCallback(() => {
          this.batch.loading = false
          this.batch.visible = false
          this.batch.callback()
          this.$Message.success(tip.success)
        }, (err) => {
          this.batch.loading = false
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
      BatchModal
    }
  }
</script>
<style scoped lang="less">
  .product-table-list {
    /deep/ .boo-table-row {
      .edit-icon {
        visibility: hidden;
      }
      &:hover .edit-icon {
        visibility: visible;
      }
    }
  }
</style>
