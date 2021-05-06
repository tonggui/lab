<template>
  <div class="sort-product-list">
    <div class="sort-header" v-if="showSmartSort">
      <template>
        <span>商品智能排序</span>
        <PermissionBtn
          component="iSwitch"
          btn-type="MANAGE_PRODUCT_AND_CLASSIFICATION_SORT"
          :need-permission="needPermission"
          size="small"
          :value="smartSortSwitch"
          @on-change="handleToggleSmartSort"
          v-mc="{ bid: 'b_jtewudr3', val: { status: `${+!smartSortSwitch}` } }"
        />
      </template>
    </div>
    <keep-alive>
      <component
        :dataSource="dataSource"
        :pagination="pagination"
        @change="handleChange"
        @page-change="handlePageChange"
        :is="sortComponent"
        v-bind="$attrs"
      ></component>
    </keep-alive>
    <Loading v-if="loading" />
  </div>
</template>
<script>
  import DragSortProductList from './drag-sort-list'
  import SmartSortProductList from './smart-sort-list'
  import Loading from '@components/loading'
  import PermissionBtn from '@/views/components/permission-bth'

  const tips = {
    sort: {
      success: '排序操作成功～',
      error: '排序操作失败！'
    },
    changeType: {
      success: '智能排序切换成功～',
      error: '智能排序切换失败！'
    }
  }

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
      loading: Boolean,
      createCallback: {
        type: Function,
        default: (success) => success
      },
      needPermission: Boolean
    },
    computed: {
      sortComponent () {
        return this.smartSortSwitch && this.showSmartSort ? SmartSortProductList : DragSortProductList
      }
    },
    components: {
      DragSortProductList,
      SmartSortProductList,
      Loading,
      PermissionBtn
    },
    methods: {
      setCallback (name) {
        const { success, error } = tips[name] || {}
        return this.createCallback(() => {
          this.$Message.success(success)
        }, (err) => {
          this.$Message.error(err.message || error)
        })
      },
      handleToggleSmartSort (v) {
        this.$emit('toggle-smart-sort', v, this.setCallback('changeType'))
      },
      handleChange (productList, product, sortOptions) {
        this.$emit('change', productList, product, sortOptions, this.setCallback('sort'))
      },
      handlePageChange (...rest) {
        this.$emit('page-change', ...rest)
      }
    }
  }
</script>
<style lang="less" scoped>
  .sort-product-list {
    position: relative;
  }
  .sort-header {
    padding: 20px 50px 20px 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid @border-color-light;
    span {
      margin-right: 5px;
    }
  }
</style>
