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
        <div slot="extra" class="product-list-table-tabs-extra">
          <slot name="tabs-extra"></slot>
        </div>
      </Tabs>
    </slot>
    <slot name="tips"></slot>
    <div class="product-list-table-body" :class="{ 'is-fixed': tableFixed }" ref="tableContainer">
      <Table
        v-bind="tableSize"
        :loading="loading"
        @on-page-change="handlePageChange"
        @on-selection-change="handleSelectionChange"
        @on-select="handleSelect"
        @on-select-cancel="handleSelectCancel"
        ref="table"
        @on-sort-change="handleSortChange"
        :pagination="pagination"
        :data="dataSource"
        :columns="selfColumns"
        :show-header="showHeader"
        no-data-text=""
        :disabled="disabled"
        :table-fixed="tableFixed"
      >
        <Affix v-if="batchOperation" slot="header">
          <div class="product-list-table-op" v-show="showBatchOperation">
            <slot name="batchOperation">
              <Tooltip :content="`已选择${selectedIdList.length}个商品`" placement="top" transfer>
                <Checkbox :disabled="disabled" :value="selectAll" :indeterminate="hasSelected && !selectAll" @on-change="handleSelectAll" class="product-list-table-op-checkbox">
                  <span style="margin-left: 20px">全选本页</span>
                </Checkbox>
              </Tooltip>
              <ButtonGroup>
                <template v-for="op in batchOperation">
                  <template v-if="batchOperationFilter(op)">
                    <PermissionBtn :need-permission="needPermission" :btn-type="op.name === '修改分类' ? 'EDIT' : 'MODIFY_ON_AND_OFF_SHELVES'" v-if="!op.children || op.children.length <= 0" class="btn-group-item" :key="op.id" :disabled="disabled" @click="handleBatch(op)">{{ op.name }}</PermissionBtn>
                    <Dropdown v-else :key="op.id">
                      <Button :disabled="disabled" style="border-top-left-radius: 0;border-bottom-left-radius: 0;border-left: 0;">
                        {{ op.name }}
                        <Icon type="keyboard-arrow-down"></Icon>
                      </Button>
                      <DropdownMenu slot="list" v-if="!disabled">
                        <template v-for="item in op.children">
                          <div v-if="batchOperationFilter(item)" :key="item.id">
                            <PermissionBtn placement="left" :need-permission="needPermission" component="DropdownItem" :btn-type="item.name === '修改库存' ? 'MODIFY_STOCK' : 'DEL_PRODUCT'" v-if="['修改库存', '删除'].includes(item.name)" :name="item.id" @click.native="havePermission && handleBatch(item)">{{ item.name }}</PermissionBtn>
                            <DropdownItem v-else :name="item.id" @click.native="handleBatch(item)">{{ item.name }}</DropdownItem>
                          </div>
                        </template>
                      </DropdownMenu>
                    </Dropdown>
                  </template>
                </template>
              </ButtonGroup>
            </slot>
          </div>
        </Affix>
        <div class="product-list-table-empty" slot="empty">
          <ProductEmpty>
            <template slot="description">
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
  import { getScrollElement } from '@/common/domUtils'
  import lx from '@/common/lx/lxReport'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  const selection = {
    type: 'selection',
    width: 36,
    align: 'center'
  }

  export default {
    name: 'product-list-table',
    mixins: [getPermissionMixin('MODIFY_STOCK')],
    props: {
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
      },
      scroll: Object,
      disabled: Boolean,
      tableFixed: Boolean, // 固定表头 + 分页，中间 table 滚动
      needPermission: Boolean // 是否需要使用权限按钮
    },
    data () {
      return {
        selectedIdList: [], // 批量操作选中的item的id列表
        needScrollTop: false // 只有切分页需要滚动到顶部
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
          // TODO 多选固定
          let selectionCol = { ...selection }
          const firstCol = this.columns[0] || {}
          selectionCol.fixed = firstCol.fixed
          return [selectionCol, ...this.columns]
        }
        return this.columns
      },
      selectAll () { // 判断是否全选本页
        if (this.loading || this.dataSource.length <= 0) {
          return false
        }
        return this.dataSource.every(({ id }) => this.selectedIdList.includes(id))
      },
      // 全选本页 半选状态
      hasSelected () {
        return !this.loading && this.selectedIdList.length > 0
      },
      tableSize () {
        if (this.scroll) {
          const { x, y } = this.scroll
          return { width: x, height: y }
        }
        return {}
      }
    },
    watch: {
      tabValue () {
        // table切换的时候需要清空batch选择数据
        this.resetBatch()
      },
      dataSource: {
        handler (dataSource) {
          if (this.selectedIdList.length > 0) {
            // TODO 主要是处理 勾选了之后，外面修改了数据
            // TODO 测试 bootes 的table，只要数据发生了变化，勾选状态就会被清楚
            // TODO 还不支持控制选中的item 暂时直接清空 so sad
            this.selectedIdList = []
          }
        },
        deep: true
      },
      loading (loading) {
        if (loading && this.needScrollTop) {
          // 数据切换时更新滚动条位置
          const $table = this.$refs.tableContainer
          if ($table.scrollTop) {
            $table.scrollTop = 0
            return
          }
          const { top } = this.$refs.tableContainer.getBoundingClientRect()
          const $scrollingElement = getScrollElement()
          if (top < 0) {
            $scrollingElement.scrollTop += top
          }
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
      handleBatch (op) {
        const { statistics } = op
        if (this.selectedIdList.length <= 0) {
          this.$Message.warning('请先选择一个商品')
          return
        }
        statistics && lx.mc(statistics)
        this.$emit('batch', op, this.selectedIdList, () => {
          this.handleSelectAll(false)
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
        this.needScrollTop = true
        this.$emit('page-change', pagination)
        this.$nextTick(() => {
          this.needScrollTop = false
        })
      },
      // 批量选择变化的时候
      handleSelectionChange (selection) {
        console.log('handleSelectionChange', selection)
        this.selectedIdList = selection.map(i => i.id)
      },
      // 单个点击变化
      handleSelect (...reset) {
        console.log('handleSelect', reset)
        this.$emit('on-select', ...reset)
      },
      handleSelectCancel (...reset) {
        this.$emit('on-select-cancel', ...reset)
      },
      // 全选本页操作
      handleSelectAll (value) {
        this.$refs.table.selectAll(value)
        this.$emit('select-all', value)
      },
      handleSortChange (params) {
        this.resetBatch()
        this.$emit('on-sort-change', params)
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
    &-tabs {
      .boo-tabs-bar {
        margin-bottom: 0;
        .boo-tabs-nav-wrap.boo-tabs-nav-scrollable {
          display: flex;
          align-items: center;
          .boo-tabs-nav-next,
          .boo-tabs-nav-prev {
            transform: translateY(-2px);
          }
        }
      }
      .boo-tabs-nav .boo-tabs-tab {
        padding: 20px 4px 21px 20px;
      }
    }
    &-tabs-extra {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      height: 61px;
    }
    &-op {
      background: #fff;
      padding: 15px 20px 15px 20px;
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
          margin-right: 1px;
        }
      }
      .btn-group-item {
        display: inline-block;
        position: relative;
        float: left;
        &:hover {
          z-index: 2;
        }
        &:first-child:not(:last-child) {
          margin-left: 0;
          .boo-btn {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
          }
        }
        &:not(:first-child):not(:last-child) {
          margin-left: -1px;
          .boo-btn {
            border-radius: 0;
          }
        }
      }
    }
    &-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      &.is-fixed {
        overflow-y: auto;
      }
      // overflow: auto;
    }
    &-empty {
      margin-top: 100px;
    }
    .boo-table {
      box-sizing: border-box;
      &,
      &-fixed,
      &-fixed-right {
        &::after, &::before {
          display: none;
        }
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
        overflow: initial;
        &.boo-table-cell-with-selection {
          padding-right: 0;
        }
      }
      .boo-table-header,
      .boo-table-fixed-header {
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
