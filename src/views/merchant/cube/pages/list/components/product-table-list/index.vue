<template>
  <ProductListFixedPage class="product-table-list-container">
    <Loading v-if="loading" />
    <div v-if="empty" class="empty" slot="content">
      <h2>此分类暂无待创建商品</h2>
      <p>请切换至其他分类继续创建～</p>
    </div>
    <template v-else>
      <Header slot="header" class="product-table-list-header">
        <div slot="left">
          <Checkbox
            :disabled="selectAllDisable"
            v-bind="selectAllStatus"
            :key="+new Date()"
            @on-change="handleSelectAll"
            class="product-table-list-op-checkbox"
          >
            <span style="margin-left: 12px">全选本页</span>
          </Checkbox>
        </div>
        <div slot="right">
          <a
            class="visible-switch"
            @click="handleExistSwitch"
          >{{ showExist ? '隐藏' : '显示' }}售卖中商品</a>
      </div>
      </Header>
      <div slot="content" class="content">
        <DoubleColumnsTableList
          :dataSource="showDataSource"
          :disabled="maxSelected <= 0"
          :selectedIdList="selectedIdList"
          :findDataIndex="findDataIndex"
          :findDataRealIndex="findDataRealIndex"
          :isItemNotSeletable="isItemNotSeletable"
          @on-select="handleSelectChange"
          @on-de-select="handleDeSelect"
          @on-tap-disabled="handleDisabled"
          class="list"
        />
      </div>
      <Pagination :pagination="pagination" slot="footer" class="pagination" @on-change="handlePageChange" />
    </template>
  </ProductListFixedPage>
</template>

<script>
  import DoubleColumnsTableList from './double-columns-table-list'
  import { isProductQualificationNotValid, getProductQualificationStatus } from '@/views/product-recommend/utils'
  import { handleToast } from '@/views/product-recommend/pages/product-recommend-list/components/qualification-tip'
  import Pagination from '@/components/pagination' // fix bootes page组件
  import Header from '@/components/header-layout'
  import ProductListFixedPage from '@/views/components/layout/product-list-fixed-page'
  import { NEW_ARRIVAL_PRODUCT_STATUS } from '@/data/enums/product'

  export default {
    name: 'product-table-list',
    props: {
      selectedIdList: Array,
      maxSelect: {
        type: Number,
        default: 100
      },
      loading: Boolean,
      pagination: Object,
      dataSource: Array
    },
    data () {
      return {
        showExist: true // 已隐藏商品
      }
    },
    computed: {
      showDataSource () {
        if (this.showExist) {
          return this.dataSource
        }
        return this.dataSource.filter(item => !(item.isExist && [NEW_ARRIVAL_PRODUCT_STATUS.ONSALE].includes(item.productStatus)))
      },
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
          const include = this.selectedIdList.includes(item.__id__)
          if (include) {
            indeterminate = true
          } else {
            value = false
          }
        })
        return { value, indeterminate: !value && indeterminate }
      },
      maxSelected () {
        return this.maxSelect - this.selectedIdList.length
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
      handleExistSwitch () {
        this.showExist = !this.showExist
      },
      findDataIndex (__id__) {
        return this.dataSource.findIndex(item => item.__id__ === __id__)
      },
      findDataRealIndex (__id__) {
        const { pageSize, current } = this.pagination
        return (pageSize * (current - 1)) + this.showDataSource.findIndex(item => item.__id__ === __id__)
      },
      isItemNotSeletable (item) {
        // 不可勾选逻辑
        // 门店不存在、门店存在且处于下架状态、门店存在且处于上架状态且库存=0三种状态商品 - 支持勾选
        // 门店存在且处于上架状态且库存>0商品置灰 - 不可勾选
        return (item.isExist && NEW_ARRIVAL_PRODUCT_STATUS.ONSALE === item.productStatus) || item.isDelete || isProductQualificationNotValid(item)
      },
      handleInvalidProduct (status, tips) {
        handleToast.call(this, status, tips)
      },
      handlePageChange (pagination) {
        this.showExist = true
        this.$emit('on-page-change', pagination)
      },
      handleDisabled (item) {
        if (getProductQualificationStatus(item)) {
          this.handleInvalidProduct(getProductQualificationStatus(item), item.qualificationTip)
        } else if (!item.isExist) {
          this.handleExceedMax()
        }
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
        if (selection && this.handleExceedMax()) {
          return
        }
        const list = this.dataSource.filter(item => {
          if (this.isItemNotSeletable(item)) {
            return false
          }
          const include = this.selectedIdList.some(id => id === item.__id__)
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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    > h2 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #36394d;
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
