<template>
  <ProductListFixedPage class="product-table-list-container">
    <Loading v-if="loading" />
    <template v-else>
      <Header slot="header" class="product-table-list-header">
        <div slot="left">
          <Checkbox
            :disabled="selectAllDisable"
            v-bind="selectAllStatus"
            :key="+new Date()"
            @on-change="handleSelectAll"
            class="product-table-list-op-checkbox"
            v-if="hasSelectAll"
          >
            <span style="margin-left: 12px">全选本页</span>
          </Checkbox>
        </div>
        <div slot="right">
          <slot name="header-right">
          </slot>
        </div>
      </Header>
      <div v-if="empty" class="empty" slot="content">
        <h2>没有搜索结果，换个词试试吧！</h2>
      </div>
      <template v-else>
        <div slot="content" class="content">
          <DoubleColumnsTableList
            :dataSource="dataSource"
            :disabled="maxSelected <= 0"
            :selectedList="selectedList"
            :findDataIndex="findDataIndex"
            :isItemNotSelectable="isItemNotSelectable"
            @on-select="handleSelectChange"
            @on-de-select="handleDeSelect"
            @on-tap-disabled="handleDisabled"
            class="list"
          >
            <template v-slot:item="{product}">
              <slot name="item" :product="product" />
            </template>
          </DoubleColumnsTableList>
        </div>
        <Pagination :pagination="pagination" slot="footer" class="pagination" @on-change="handlePageChange" />
      </template>
    </template>
  </ProductListFixedPage>
</template>

<script>
  import DoubleColumnsTableList from './double-columns-table-list'
  import Pagination from '@/components/pagination' // fix bootes page组件
  import Header from '@/components/header-layout'
  import ProductListFixedPage from '@/views/components/layout/product-list-fixed-page'

  export default {
    name: 'product-table-list',
    props: {
      selectedList: {
        type: Array,
        default: () => []
      },
      maxSelect: {
        type: Number,
        default: 100
      },
      loading: {
        type: Boolean,
        default: false
      },
      pagination: {
        type: Object,
        default: () => ({
          current: 1,
          pageSize: 20,
          total: 0
        })
      },
      dataSource: {
        type: Array,
        default: () => []
      },
      hasSelectAll: {
        type: Boolean,
        default: false
      },
      selectableTester: Function
    },
    computed: {
      isAllUnselectable () {
        return this.dataSource.every(item => this.isItemNotSeletable(item))
      },
      selectAllStatus () {
        if (this.loading || this.isAllUnselectable) {
          return { value: false, indeterminate: false }
        }
        let value = true
        let indeterminate = false
        this.dataSource.forEach(item => {
          if (this.isItemNotSeletable(item)) {
            return
          }
          const include = this.selectedList.includes(item.id)
          if (include) {
            indeterminate = true
          } else {
            value = false
          }
        })
        return { value, indeterminate: !value && indeterminate }
      },
      maxSelected () {
        return this.maxSelect - this.selectedList.length
      },
      selectAllDisable () {
        if (this.isAllUnselectable) {
          return true
        }
        const { value, indeterminate } = this.selectAllStatus
        return this.maxSelected <= 0 && !value && !indeterminate
      },
      empty () {
        return !this.loading && this.dataSource.length === 0
      }
    },
    components: {
      DoubleColumnsTableList,
      Header,
      Pagination,
      ProductListFixedPage
    },
    methods: {
      findDataIndex (id) {
        return this.dataSource.findIndex(item => item.id === id)
      },
      isItemNotSelectable (item, selectedList = this.selectedList, productList = this.dataSource) {
        if (this.maxSelected <= 0) {
          return true
        }
        if (this.selectableTester) {
          try {
            return !this.selectableTester(item, selectedList, productList)
          } catch {
            return true
          }
        }
        return false
      },
      handleDisabled (item) {
        if (!this.handleExceedMax()) {
          if (this.selectableTester) {
            try {
              this.selectableTester(item, this.selectedList, this.dataSource)
            } catch (e) {
              this.$Message.info({
                content: e.message
              })
            }
          }
        }
      },
      handlePageChange (pagination) {
        this.$emit('on-page-change', pagination)
      },
      handleExceedMax () {
        if (this.maxSelected <= 0) {
          this.$Message.info({
            content: `单次最多可选${this.maxSelect}个, 请先创建已选商品`
          })
          return true
        }
        return false
      },
      handleSelectAll (selection) {
        const list = this.dataSource.filter(item => {
          if (this.isItemNotSelectable(item)) {
            return false
          }
          const include = this.selectedIdList.some(id => id === item.id)
          return selection ? !include : include
        })
        if (selection) {
          this.handleSelectChange(list)
        } else {
          this.handleDeSelect(list)
        }
      },
      handleSelectChange (items) {
        if (this.handleExceedMax()) {
          return
        }
        if (this.maxSelected < items.length) {
          this.$Message.info({
            content: `单次选择已达上限 ${this.maxSelect}, 仅选中本页前 ${this.maxSelected} 个商品`
          })
          items = items.slice(0, this.maxSelected)
        }
        this.$emit('on-select', items)
      },
      handleDeSelect (deSelectItem) {
        this.$emit('on-de-select', deSelectItem)
      }
    }
  }
</script>

<style lang="less" scoped>
.product-table-list-container {
  position: relative;
  height: 100%;
  /deep/ .product-list-fixed-page-layout-content {
    height: calc(100% - 121px);
  }
  .product-table-list {
    &-header {
      height: 52px;
      padding: 0 20px 0 32px;
      position: sticky;
      top: 0;
      z-index: 2;
      flex-shrink: 0;
      .product-table-list-op-checkbox {
        font-size: 0;
        /deep/ .boo-checkbox-inner {
          vertical-align: middle;
        }
        > span {
          font-family: PingFangSC-Regular;
          font-size: @font-size-base;
          display: inline-block;
          vertical-align: middle;
          margin-right: 1px;
        }
      }
      .visible-switch {
        font-size: 14px;
        color: #676A78;
        line-height: 14px;
        text-decoration: underline;
      }
    }
  }
  .pagination {
    flex-shrink: 0;
    text-align: right;
    padding: 16px 20px;
    border-top: 1px solid #E9EAF2;
    width: 100%;
  }
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    > h2 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      // color: #36394d;
      color: #999999;
      text-align: center;
      line-height: 16px;
      margin-bottom: 8px;
    }
    > p {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      text-align: center;
      line-height: 14px;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
  }
}
</style>
