<template>
  <ProductListPage class="product-table-list-container">
    <DoubleColumnsTableList :dataSource="dataSource" @on-select-change="handleSelectChange" ref="double-table" slot="content">
      <Header slot="header" class="product-table-list-header">
        <div slot="left">
          <Checkbox :disabled="disabled" :value="hasSelectAll" :indeterminate="hasSelected && !hasSelectAll" @on-change="handleSelectAll" class="product-table-list-op-checkbox">
            <span style="margin-left: 12px">全选本页</span>
          </Checkbox>
        </div>
        <div slot="right">
          <span :class="[selectionList.length ? 'selected' : 'un-select']">查看已选商品</span>
          <Button type="primary" :disabled="!selectionList.length">{{computedButtonText}}</Button>
        </div>
      </Header>
    </DoubleColumnsTableList>
    <Pagination slot="footer" :pagination="pagination" class="pagination" />
  </ProductListPage>
</template>

<script>
  import DoubleColumnsTableList from './double-columns-table-list'
  import Pagination from '@/components/pagination' // fix bootes page组件
  import Header from '@/components/header-layout'
  import ProductListPage from '@/views/components/layout/product-list-page'

  export default {
    name: 'product-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      },
      pagination: {
        type: Object,
        default: () => ({
          current: 1,
          pageSize: 20,
          total: 20,
          showTotal: true,
          pageSizeOpts: [20, 50, 100],
          showElevator: true,
          showSizer: true
        })
      }
    },
    data () {
      return {
        hasSelected: false,
        hasSelectAll: false,
        disabled: false,
        selectionList: []
      }
    },
    computed: {
      computedButtonText () {
        return this.selectionList.length ? `确定创建(${this.selectionList.length})` : '确定创建'
      }
    },
    components: {
      DoubleColumnsTableList,
      Header,
      Pagination,
      ProductListPage
    },
    methods: {
      handleSelectAll (selection) {
        if (selection) this.$refs['double-table'].selectAll()
        else this.$refs['double-table'].deSelectAll()
      },
      handleSelectChange (keys) {
        console.log('keys', keys)
        this.selectionList = [...keys]
        if (keys.length) this.hasSelected = true
        else this.hasSelected = false

        if (keys.length === this.dataSource.length) this.hasSelectAll = true
        else this.hasSelectAll = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-table-list-container {
    .product-table-list {
      &-header {
        height: 52px;
        padding: 0 20px 0 32px;

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
        .un-select {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #CCCCCC;
          line-height: 14px;
          margin-right: 16px;
        }
        .selected {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #676A78;
          line-height: 14px;
          text-decoration: underline;
          margin-right: 16px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .pagination {
      text-align: right;
      padding: 0 20px;
    }
  }
</style>
