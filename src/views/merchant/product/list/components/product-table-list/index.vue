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
        :render-tab-label="renderTabLabel"
        :dataSource="dataSource"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        class="product-table-list"
      >
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
  import ProductTableList from '@components/product-list-table'
  import Columns from './components/columns'
  import lx from '@/common/lx/lxReport'
  import { createCallback } from '@/common/vuex'
  import localStorage, { KEYS } from '@/common/local-storage'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

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
    methods: {
      renderTabLabel (h, item) {
        return <div>{item.name} <span>{item.count}</span></div>
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
      ProductTableList
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
  }
</style>
