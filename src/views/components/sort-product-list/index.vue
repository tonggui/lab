<template>
  <div class="sort-product-list">
    <div class="sort-header" v-if="showSmartSort">
      <template>
        <span>商品智能排序</span>
        <iSwitch size="small" :value="smartSortSwitch" @on-change="handleToggleSmartSort" />
      </template>
    </div>
    <component
      :dataSource="dataSource"
      :pagination="pagination"
      @change="$listeners['change-list']"
      :is="sortComponent"
      v-bind="$attrs"
    ></component>
    <Loading :loading="loading" />
  </div>
</template>
<script>
  import DragSortProductList from './drag-sort-list'
  import SmartSortProductList from './smart-sort-list'
  import Loading from '@components/loading'

  /**
   * 商品排序容器组件
   * 协调智能排序 && 拖拽排序
   */
  export default {
    name: 'sort-product-list',
    props: {
      showSmartSort: Boolean,
      smartSortSwitch: Boolean,
      dataSource: Array,
      pagination: Object,
      loading: Boolean
    },
    computed: {
      sortComponent () {
        return this.smartSortSwitch && this.showSmartSort ? SmartSortProductList : DragSortProductList
      }
    },
    components: {
      DragSortProductList,
      SmartSortProductList,
      Loading
    },
    methods: {
      handleToggleSmartSort (v) {
        this.$emit('toggle-smart-sort', v)
      }
    }
  }
</script>
<style lang="less" scoped>
  .sort-product-list {
    position: relative;
  }
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
