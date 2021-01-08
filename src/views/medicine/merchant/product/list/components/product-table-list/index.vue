<template>
  <Columns
    :tab="status"
    @delete="handleDelete"
    @edit-product="handleEdit"
    @edit-sku="handleEditSku"
    @check-change="handleCheckChange"
  >
    <template v-slot:default="{columns}">
      <ProductTableList
        :showSelectAll="showSelectAll"
        show-header
        :tab-value="status"
        :tabs="statusList"
        :tab-pane-filter="isShowTabPane"
        :render-tab-label="renderTabLabel"
        :dataSource="dataSource"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        :batchOperation="batchOperation"
        @page-change="handlePageChange"
        @tab-change="handleStatusChange"
        @batch="handleBatch"
        class="product-table-list"
      >
        <template slot="tips" v-if="isShowTips">
          <p class="tips">初次使用该功能，请确认通UPC编码的商品是否有多个货号或分类，请修正后使用</p>
        </template>
        <template slot="batchOperation" v-if="COMPLETED">
          <Search @submit="handleSearch" @clear="handleClear" :defaultData="searchData" :formItems="{date: true, category: false, isOtc: false}" wrapClass="tabe-list-search-container" btnClass="tabel-list-search-btns"/>
        </template>
        <template slot="tabs-extra">
          <slot name="tabs-extra"></slot>
        </template>
        <template slot="empty">
          <slot name="empty" />
        </template>
      </ProductTableList>
    </template>
  </Columns>
</template>
<script>
  import ProductTableList from './components/list-table'
  import Search from '../../../search-list/components/filter-form'
  import Columns from './components/columns'
  import lx from '@/common/lx/lxReport'
  import { createCallback } from '@/common/vuex'
  import localStorage, { KEYS } from '@/common/local-storage'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import { MERCHANT_PRODUCT_STATUS, MEDICINE_MERCHANT_PRODUCT_STATUS } from '@/data/enums/product'
  import { batchOperation } from './constants'

  export default {
    name: 'product-list-table-container',
    props: {
      showSelectAll: Boolean,
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
      },
      defaultBatchOperation: { // 批量操作按钮的信息(商品查询的)
        type: [Boolean, Array],
        default: false
      },
      searchData: { // 优化记录页面-搜索框数据
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      INCOMPLETE () {
        return this.status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE
      },
      COMPLETED () {
        return this.status === MEDICINE_MERCHANT_PRODUCT_STATUS.COMPLETED
      },
      batchOperation () {
        if (this.defaultBatchOperation) {
          return this.defaultBatchOperation
        } else {
          return (this.INCOMPLETE || this.COMPLETED) ? batchOperation : false
        }
      },
      isShowTips () {
        return this.statusList.length && this.status === MEDICINE_MERCHANT_PRODUCT_STATUS.ALL
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
      },
      handleBatch (...args) {
        this.$emit('batch', ...args)
      },
      handleCheckChange (...args) {
        this.$emit('check-change', ...args)
      },
      handleSearch (...args) {
        this.$emit('search', ...args)
      },
      handleClear (...args) {
        this.$emit('clear', ...args)
      }
    },
    components: {
      Columns: withPromiseEmit(Columns),
      ProductTableList,
      Search
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
    .tips {
      padding: 10px 10px 0;
      color: @brand-auxiliaray-color-2;
    }
  }
</style>
<style lang="less">
.tabe-list-search-container {
  position: relative;
  padding: 0 !important;
  margin-bottom: 0 !important;
  .tabel-list-search-btns {
    position: absolute;
    right: 0;
    bottom: 16px;
    width: 33%;
  }
}
</style>
