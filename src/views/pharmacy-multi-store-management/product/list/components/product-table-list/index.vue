<template>
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
        :tab-pane-filter="isShowTabPane"
        :render-tab-label="renderTabLabel"
        :dataSource="dataSource"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        @tab-change="handleStatusChange"
        class="product-table-list"
      >
        <ProductTabs slot="batchOperation"/>
        <!-- <template slot="tabs-extra">
          <slot name="tabs-extra"></slot>
        </template> -->
        <template slot="empty">
          <slot name="empty" />
        </template>
      </ProductTableList>
    </template>
  </Columns>
</template>
<script>
  import ProductTableList from '@components/product-list-table'
  import ProductTabs from './components/tabs'
  import Columns from './components/columns'
  import lx from '@/common/lx/lxReport'
  import { createCallback } from '@/common/vuex'
  import localStorage, { KEYS } from '@/common/local-storage'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import { MERCHANT_PRODUCT_STATUS } from '@/data/enums/product'
  import { batchOperation } from './constants'

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
    computed: {
      batchOperation () {
        return batchOperation
      }
    },
    methods: {
      isShowTabPane (item) {
        if (item.id === MERCHANT_PRODUCT_STATUS.MISSING_INFORMATION) {
          // 如果当前查询条件为缺失商品，则非空场景下也显示
          if (item.id === `${this.status}`) {
            return true
          }
          return item.count > 0
        }
        return true
      },
      renderTabLabel (h, item) {
        const { name, count, needDanger = false, tooltip, badge } = item
        let $count = null
        if (this.showTabItemNumber && count !== undefined) {
          if (badge) {
            $count = (<Badge style={{ marginLeft: '5px' }} count={count} />)
          } else {
            $count = (<span class={needDanger && count > 0 ? 'danger' : ''}>{count}</span>)
          }
        }
        const $tabLabel = (
          <div>
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
      handleEditSku (product, skuList, type, params) {
        return new Promise((resolve, reject) => {
          this.$emit('edit-sku', { product, skuList, type, params }, this.createCallback(resolve, reject))
        })
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
      }
    },
    components: {
      Columns: withPromiseEmit(Columns),
      ProductTableList,
      ProductTabs
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
      }
    }
  }
</style>
