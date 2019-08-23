<template>
  <div class="product-list-table">
    <slot name="tabs">
      <Tabs :value="tabValue" @on-click="handleTabChange" class="product-list-table-tabs" v-if="showTabs">
        <template v-for="item in tabs">
          <TabPane
            v-if="tabPaneFilter(item)"
            :label="h => renderTabLabel(h, item)"
            :name="item.id"
            :key="item.id"
          />
        </template>
        <template slot="extra">
          <slot name="tabs-extra"></slot>
        </template>
      </Tabs>
    </slot>
    <div class="product-list-table-body">
      <Table
        :loading="loading"
        @on-page-change="handlePageChange"
        @on-selection-change="handleSelectionChange"
        ref="table"
        :pagination="pagination"
        :data="dataSource"
        :columns="selfColumns"
        :show-header="isShowHeader"
        no-data-text=""
      >
        <Affix v-if="batchOperation" slot="header">
          <div class="product-list-table-op" v-show="showBatchOperation">
            <slot name="batchOperation">
              <Tooltip :content="`已选择${selectedIdList.length}个商品`" placement="top">
                <Checkbox :value="selectAll" :indeterminate="hasSelectId && !selectAll" @on-change="handleSelectAll" class="product-list-table-op-checkbox">
                  <span style="margin-left: 20px">全选本页</span>
                </Checkbox>
              </Tooltip>
              <ButtonGroup>
                <template v-for="op in batchOperation">
                  <template v-if="batchOperationFilter(op)">
                    <Button v-if="!op.children || op.children.length <= 0" :key="op.id" @click="handleBatch(op.id)">{{ op.name }}</Button>
                    <Dropdown v-else :key="op.id" @on-click="handleBatch">
                      <Button style="border-top-left-radius: 0;border-bottom-left-radius: 0;border-left: 0;">
                        {{ op.name }}
                        <Icon type="keyboard-arrow-down"></Icon>
                      </Button>
                      <DropdownMenu slot="list">
                        <template v-for="item in op.children">
                          <DropdownItem v-if="batchOperationFilter(op)" :key="item.id" :name="item.id">{{ item.name }}</DropdownItem>
                        </template>
                      </DropdownMenu>
                    </Dropdown>
                  </template>
                </template>
              </ButtonGroup>
            </slot>
          </div>
        </Affix>
        <div v-if="isEmpty" class="product-list-table-empty" slot="empty">
          <ProductEmpty>
            <template slot="empty">
              <slot name="empty"></slot>
            </template>
          </ProductEmpty>
        </div>
      </Table>
    </div>
  </div>
</template>
<script>
  import Table from '@components/table-with-page'

  const selection = {
    type: 'selection',
    width: 36,
    align: 'center'
  }

  export default {
    name: 'product-list-table',
    props: {
      tagId: Number,
      showHeader: Boolean, // 是否显示table表头
      tabs: { // tabs 信息呢
        type: [Boolean, Array],
        default: false
      },
      tabValue: [String, Number], // tab当前选中值
      renderTabLabel: { // 渲染tab函数
        type: Function,
        default: (h, item) => item.name
      },
      tabPaneFilter: { // tab是否展示函数
        type: Function,
        default: () => true
      },
      batchOperation: { // 批量操作按钮的信息
        type: [Boolean, Array],
        default: false
      },
      batchOperationFilter: { // 批量按钮是否展示函数
        type: Function,
        default: () => true
      },
      columns: { // table的列信息
        type: Array,
        required: true
      },
      dataSource: { // table数据
        type: Array,
        default: () => []
      },
      pagination: { // 分页信息
        type: Object,
        default: () => ({
          current: 1,
          pageSize: 20,
          total: 0,
          pageSizeOpts: [20, 50, 100],
          showElevator: true,
          showSizer: true
        })
      },
      loading: { // 加载中...
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedIdList: [] // 批量操作选中的item的id列表
      }
    },
    computed: {
      showTabs () {
        return !!this.tabs
      },
      showBatchOperation () {
        return !!this.batchOperation
      },
      selfColumns () {
        // 存在批量操作的时候需要有 selection 列
        if (this.batchOperation) {
          return [selection, ...this.columns]
        }
        return this.columns
      },
      selectAll () { // 判断是否全选本页
        if (this.loading || this.isEmpty) {
          return false
        }
        return this.dataSource.every(({ id }) => this.selectedIdList.includes(id))
      },
      // 全选本页 半选状态
      hasSelectId () {
        return !this.loading && this.selectedIdList.length > 0
      },
      isShowHeader () { // 不存在数据的时候是不能显示表头的
        if (this.showHeader) {
          return this.dataSource.length > 0
        }
        return this.showHeader
      },
      isEmpty () {
        return !this.loading && this.dataSource.length <= 0
      }
    },
    watch: {
      tabValue () {
        // table切换的时候需要清空batch选择数据
        this.resetBatch()
      },
      tagId () {
        // tag切换的时候需要清空batch选择数据
        this.resetBatch()
      },
      dataSource (dataSource) {
        if (this.selectedIdList.length > 0) {
          // TODO 主要是处理 勾选了之后，外面修改了数据
          // TODO 测试 bootes 的table，只要数据发生了变化，勾选状态就会被清楚
          // TODO 还不支持控制选中的item 暂时直接清空 so sad
          this.selectedIdList = []
          // const selectedChange = this.selectedIdList.some(id => {
          //   return !this.dataSource.find(item => item.id === id)
          // })
          // // TODO bootes table 不支持控制选中的item 暂时直接清空
          // if (selectedChange) {
          //   this.selectedIdList = []
          // }
        }
      }
    },
    components: {
      Table
    },
    methods: {
      // 清空batch选择数据
      resetBatch () {
        this.selectedIdList = []
      },
      // 处理批量操作
      handleBatch (type) {
        if (this.selectedIdList.length <= 0) {
          this.$Message.warning('请先选择一个商品')
          return
        }
        this.$emit('batch', type, this.selectedIdList, () => {
          this.resetBatch()
        })
      },
      // 处理tab切换
      handleTabChange (value) {
        if (value !== this.tabValue) {
          this.$emit('tab-change', value)
        }
      },
      // 处理分页切换
      handlePageChange (pagination) {
        // batch是全选本页，分页切换的时候清楚batch
        this.resetBatch()
        this.$emit('page-change', pagination)
      },
      // 批量选择变化的时候
      handleSelectionChange (selection) {
        this.selectedIdList = selection.map(i => i.id)
      },
      // 全选本页操作
      handleSelectAll (value) {
        this.$refs.table.selectAll(value)
      }
    }
  }
</script>
<style lang="less">
  .product-list-table {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    // TODO 滚动条位置
    .boo-spin-fix .boo-spin-main {
      top: 50vh;
    }
    &-tabs {
      .boo-tabs-bar {
        margin-bottom: 0;
      }
      .boo-tabs-nav .boo-tabs-tab {
        padding: 20px 20px 21px 20px;
      }
    }
    &-op {
      background: #fff;
      padding: 15px 20px 4px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 5px 0 rgba(64,65,87,.05);
      &-checkbox {
        font-size: 0;
        /deep/ .boo-checkbox-inner {
          vertical-align: middle;
        }
        > span {
          font-size: @font-size-base;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    &-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      > div:first-child {
        flex: 1;
      }
    }
    &-empty {
      margin-top: 100px;
    }
    .boo-table {
      box-sizing: border-box;
      &::after {
        display: none;
      }
      th {
        color: @text-tip-color;
        background-color: #fff;
        padding: 16px 0;
        .boo-table-cell.boo-table-cell-with-selection {
          display: none;
        }
      }
      th, td {
        border-bottom: none;
      }
      &-row {
        height: 90px;
      }
      .boo-table-cell {
        padding-left: 20px;
        padding-right: 20px;
        &.boo-table-cell-with-selection {
          padding-right: 0;
        }
      }
      .boo-table-header {
        position: relative;
        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0px;
          right: 0px;
          height: 1px;
          background: @border-color-light;
        }
      }
    }
    .boo-table-tip {
      height: 100%;
      padding-top: 20%;
    }
  }
</style>
