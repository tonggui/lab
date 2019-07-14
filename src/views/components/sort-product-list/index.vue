<template>
  <div v-if="sorting">
    <div class="sort-header" v-if="showSmartSort">
      <template>
        <span>商品智能排序</span>
        <iSwitch size="small" :value="smartSortSwitch" @on-change="handleToggleSmartSort" />
      </template>
    </div>
    <component
      :dataSource="productList"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @change-list="handleChangeList"
      :is="sortComponent"
      v-bind="$attrs"
    ></component>
  </div>
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
  </ManageProductList>
</template>
<script>
  import DragSortProductList from './drag-sort-list'
  import SmartSortProductList from './smart-sort-list'
  import ManageProductList from '@components/product-list-table'

  export default {
    name: 'sort-product-list-container',
    props: {
      sorting: Boolean,
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
    computed: {
      sortComponent () {
        return this.smartSortSwitch && this.showSmartSort ? SmartSortProductList : DragSortProductList
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
      DragSortProductList,
      SmartSortProductList,
      ManageProductList
    }
  }
</script>
<style lang="less" scoped>
.sort-header {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid @border-color-light;
  span {
    margin-right: 5px;
  }
}
</style>
