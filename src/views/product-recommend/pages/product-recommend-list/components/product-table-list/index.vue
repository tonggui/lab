<template>
  <keep-alive>
    <ProductListPage class="product-table-list-container">
      <FlashLoading v-show="loading" />
      <template v-if="dataSource.length">
        <DoubleColumnsTableList
          :dataSource="dataSource"
          ref="double-table"
          slot="content"
          :maxSelected="maxSelected"
          :showExist="showExist"
          @on-exceed-max="handleExceedMax"
          @on-select="handleSelectChange"
          @on-de-select="handleDeSelect"
        >
          <Header slot="header" class="product-table-list-header">
            <div slot="left">
              <Checkbox
                :disabled="selectAllDisable"
                :value="hasSelectAll"
                :indeterminate="hasSelected && !hasSelectAll"
                @on-change="handleSelectAll"
                class="product-table-list-op-checkbox"
              >
                <span style="margin-left: 12px">全选本页</span>
              </Checkbox>
            </div>
            <div slot="right">
              <a class="visible-switch" @click="showExist = !showExist">{{ showExist ? '隐藏' : '显示' }}已有商品</a>
            </div>
          </Header>
        </DoubleColumnsTableList>
        <Pagination slot="footer" :pagination="pagination" class="pagination" @on-change="handlePageChange" />
      </template>
      <div class="empty" slot="content" v-else>
        <h2>此分类暂无待创建商品</h2>
        <p>请切换至其他分类继续创建～</p>
      </div>
    </ProductListPage>
  </keep-alive>
</template>

<script>
  import DoubleColumnsTableList from './double-columns-table-list'
  import Pagination from '@/components/pagination' // fix bootes page组件
  import Header from '@/components/header-layout'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import FlashLoading from '@/components/loading'
  import { helper } from '@/views/product-recommend/store'

  const { mapGetters, mapActions, mapState } = helper('product')
  export default {
    name: 'product-table-list',
    props: {
      totalSelectedCount: {
        type: Number,
        default: 0
      },
      maxSelect: {
        type: Number,
        default: 100
      }
    },
    data () {
      return {
        hasSelected: false,
        hasSelectAll: false,
        disabled: false,
        selectionList: [],
        showExist: true // 已隐藏商品
      }
    },
    computed: {
      ...mapState(['loading']),
      ...mapGetters({
        pagination: 'getPagination',
        dataSource: 'getList'
      }),
      maxSelected () {
        return this.maxSelect - this.totalSelectedCount
      },
      selectAllDisable () {
        return !this.maxSelected && !this.selectionList.length
      }
    },
    components: {
      DoubleColumnsTableList,
      Header,
      Pagination,
      ProductListPage,
      FlashLoading
    },
    methods: {
      ...mapActions(['pageChange', 'selectProduct', 'deSelectProduct']),
      handlePageChange (pagination) {
        this.showExist = true
        this.hasSelected = false
        this.hasSelectAll = false
        this.pageChange(pagination)
      },
      handleExceedMax () {
        if (this.totalSelectedCount >= this.maxSelect) {
          this.$Message.info({
            content: `单次最多可选${this.maxSelect}个, 请先创建已选商品`
          })
        }
      },
      handleSelectAll (selection) {
        if (this.totalSelectedCount >= this.maxSelect) {
          this.$Message.info({
            content: `单次最多可选${this.maxSelect}个, 请先创建已选商品`
          })
          return
        }
        if (selection) {
          this.$refs['double-table'].selectAll()
          if (this.maxSelect <= this.dataSource.filter(item => !item.id).length) {
            this.$Message.info({
              content: `单次选择已达上限 ${this.maxSelect}, 仅选中本页前 ${this.maxSelected} 个商品`
            })
          }
        } else this.$refs['double-table'].deSelectAll()
      },
      checkSelectStatus () {
        if (this.selectionList.length) this.hasSelected = true
        else this.hasSelected = false

        if (this.selectionList.length === this.dataSource.filter(item => !item.id).length) this.hasSelectAll = true
        else this.hasSelectAll = false
      },
      handleSelectChange (items, selectedItems) {
        this.selectionList = [...selectedItems]
        this.checkSelectStatus()
        this.selectProduct(items)
      },
      handleDeSelect (deSelectItem, selectedItems) {
        if (deSelectItem.length === 1) this.selectionList = [...this.selectionList.filter(item => item.__id__ !== deSelectItem[0].__id__)]
        else this.selectionList = [this.selectionList, ...selectedItems]
        this.checkSelectStatus()
        this.deSelectProduct(deSelectItem)
      }
    }
  }
</script>

<style lang="less" scoped>
.product-table-list-container {
  position: relative;
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
      .visible-switch {
        font-size: 14px;
        color: #676A78;
        line-height: 14px;
        text-decoration: underline;
      }
    }
  }
  .pagination {
    text-align: right;
    padding: 0 20px;
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
}
</style>
