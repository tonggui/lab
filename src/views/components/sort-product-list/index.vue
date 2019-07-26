<template>
  <SortProductList v-if="sorting"
    :dataSource="productList"
    :pagination="pagination"
    :loading="loading"
    :maxOrder="maxOrder"
    @toggle-smart-sort="handleToggleSmartSort"
    @change-list="handleChangeList"
    :showSmartSort="showSmartSort"
    :smartSortSwitch="smartSortSwitch"
    v-bind="$attrs"
  />
  <ManageProductList v-else
    :tab-value="tabValue"
    :tabs="tabs"
    :render-tab-label="renderTabLabel"
    :tab-pane-filter="tabPaneFilter"
    @tab-change="handleTabChange"
    :batchOperation="batchOperation"
    :batch-operation-filter="batchOperationFilter"
    :dataSource="productList"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    @page-change="handlePageChange"
    @batch="handleBatchOp"
    v-bind="$attrs"
  >
    <template slot="tabs-extra">
      <slot name="tabs-extra"></slot>
    </template>
    <template slot="empty">
      <slot name="empty"></slot>
    </template>
  </ManageProductList>
</template>
<script>
  import SortProductList from './sort-product-list'
  import ManageProductList from '@components/product-list-table'

  export default {
    name: 'sort-product-list-container',
    props: {
      sorting: Boolean,
      maxOrder: {
        type: Number,
        default: Infinity
      },
      productList: Array,
      pagination: Object,
      loading: Boolean,
      smartSortSwitch: Boolean,
      showSmartSort: Boolean,
      tabs: Array,
      tabValue: [Number, String],
      batchOperation: Array,
      renderTabLabel: Function,
      tabPaneFilter: Function,
      batchOperationFilter: Function,
      columns: {
        type: Array,
        required: true
      }
    },
    methods: {
      handlePageChange (page) {
        this.$emit('page-change', page)
      },
      handleTabChange (value) {
        this.$emit('tab-change', value)
      },
      handleBatchOp (...rest) {
        this.$emit('batch', ...rest)
      },
      handleChangeList (list) {
        this.$emit('change-list', list)
      },
      handleToggleSmartSort (value) {
        this.$emit('toggle-smart-sort', value)
      }
    },
    components: {
      SortProductList,
      ManageProductList
    }
  }
</script>
