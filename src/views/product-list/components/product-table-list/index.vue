<template>
  <div>
    <!-- TODO: 给行内添加Tab状态值 -->
    <Columns
      :tagId="tagId"
      :disabled="disabled"
      :tab-value="status"
      @delete="handleDelete"
      @edit-product="handleEdit"
      @edit-sku="handleEditSku"
      @refresh="$emit('refresh')"
    >
      <template v-slot:default="{columns}">
        <!-- TODO: 商家商品列表二级包裹 isShowTabPane判断是否展示tab -->
        <ProductTableList
          need-permission
          :disabled="disabled"
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
    PRODUCT_BATCH_OP, PACKAGE_PRODUCT_OPT_STATUS
  } from '@/data/enums/product'
  import {
    PRODUCT_SELL_TIME,
    PRODUCT_LABEL,
    PRODUCT_INCOMPLETE_TAB
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import ProductTableList from '@components/product-list-table'
  import BatchModal from './components/batch-modal'
  import PackageProductUnitTable from './components/package-product-unit-table'
  import Columns from './components/columns'
  import Tooltip from '@/components/tooltip'
  import { Badge } from '@roo-design/roo-vue'
  import { batchOperation } from './constants'
  import lx from '@/common/lx/lxReport'
  import { createCallback } from '@/common/vuex'

  export default {
    name: 'product-list-table-container',
    props: {
      tagId: Number,
      tagList: Array,
      status: [Number, String],
      statusList: [Array, Boolean],
      dataSource: Array,
      pagination: Object,
      loading: Boolean,
      createCallback: {
        type: Function,
        default: createCallback
      },
      disabled: Boolean,
      showTabItemNumber: {
        type: Boolean,
        default: true
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
    mounted () {
      // TODO: 库存不足首次展示mv 埋点
      if (this.status && this.status === PRODUCT_STATUS.STOCK_INSUFFICIENT_COUNT) {
        lx.mv({ bid: 'b_shangou_online_e_lrhx6wkv_mc' }, 'productListTableContainer')
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
    watch: {
      // TODO: 库存不足切换展示mv 埋点
      status (value) {
        if (value === PRODUCT_STATUS.STOCK_INSUFFICIENT_COUNT) {
          lx.mv({ bid: 'b_shangou_online_e_lrhx6wkv_mc' }, 'productListTableContainer')
        }
      }
    },
    methods: {
      renderTabLabel (h, item) {
        const { name, count, needDanger = false, id, tooltip, badge } = item
        let $count = null
        if (this.showTabItemNumber) {
          if (badge) {
            $count = (<Badge style={{ marginLeft: '5px' }} count={count} />)
          } else {
            $count = (<span class={needDanger && count > 0 ? 'danger' : ''}>{count}</span>)
          }
        }
        const $tabLabel = (
          <div vMc={{ bid: 'b_hc05e0n2', val: { type: +id + 1 } }}>
            {name}
            {$count}
          </div>
        )
        if (tooltip) {
          return (
            <Tooltip
              transfer={true}
              placement="top"
              offset={10}
              zIndex={980}
              type={tooltip.type}
              content={tooltip.content}
              keyName={tooltip.keyName}
            >{$tabLabel}</Tooltip>)
        }
        return $tabLabel
      },
      // TODO: 新增【库存不足】列表展示逻辑
      isShowTabPane (item) {
        if (item.id === PRODUCT_STATUS.INCOMPLETE) {
          return this.showIncompleteTab
        } else if (item.id === PRODUCT_STATUS.MISSING_INFORMATION) {
          // 如果当前查询条件为缺失商品，则非空场景下也显示
          if (item.id === `${this.status}`) {
            return true
          }
          return item.count > 0
        } else if (item.id === PRODUCT_STATUS.STOCK_INSUFFICIENT_COUNT) {
          // 如果当前查询条件为缺失商品，则非空场景下也显示
          if (item.id === `${this.status}`) {
            return true
          }
          return item.count > 0
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
      handleDelete (product, isCurrentTag = false, force = false, callback = noop) {
        this.$emit('delete', { product, isCurrentTag, force }, callback)
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
      BatchModal
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
        &.display-none {
          display: none;
        }
      }
      &:hover .edit-icon {
        visibility: visible;
      }
    }
  }
</style>
