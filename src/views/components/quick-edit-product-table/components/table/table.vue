<template>
  <div class="quick-edit-product-table-container" ref="container">
    <slot name="header"></slot>
    <template v-if="isEmpty">
      <slot name="empty"><Empty :description="noDataText || '暂无数据'" /></slot>
    </template>
    <div class="table" :class="{ 'is-border': border }" ref="table">
      <TableHead
        v-show="selfShowHeader"
        class="table-head"
        :styles="headStyles"
        :columns="fullColumns"
        :setHeadCellWidth="setHeadCellWidth"
        :getCellStyle="getCellStyle"
        @on-select-all="handleSelectAll"
      />
      <div ref="tbodyContainer" class="table-body" :style="tbodyContainerStyles">
        <div ref="tbody">
          <div v-for="(item, index) in groupList" :key="index">
            <slot name="groupHeader" :group="item"></slot>
            <TableBody
              :styles="bodyStyles"
              :setCellWidth="setCellWidth"
              :getSpan="getSpan"
              :getCellStyle="getCellStyle"
              :getRow="getRow"
              :columns="fullColumns"
              :data="item.productList"
              :rowKey="rowKey"
              :rowSelection="rowSelection"
              @on-select="handleSelect"
            >
              <template v-slot:row-bottom="props">
                <slot name="row-bottom" v-bind="props"></slot>
              </template>
            </TableBody>
          </div>
        </div>
      </div>
    </div>
    <div v-show="data.length">
      <Pagination
        v-if="pagination"
        :pagination="pagination"
        @on-change="handlePageChange"
        class="pagination"
        ref="pagination"
      />
    </div>
    <slot name="footer"></slot>
    <Loading v-if="loading" />
  </div>
</template>
<script>
  import { getScrollBarSize } from '@/common/domUtils'
  import { isFunction, isArray, isObject } from 'lodash'
  import TableHead from './table-head'
  import TableBody from './table-body'

  export default {
    name: 'quick-edit-product-table',
    props: {
      loading: Boolean,
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      },
      pagination: {
        type: Object,
        default: null
      },
      tableFixed: Boolean,
      border: {
        type: Boolean,
        default: false
      },
      noDataText: String,
      spanMethod: Function,
      showHeader: {
        type: Boolean,
        default: true
      },
      getRow: {
        type: Function,
        default: (row) => row
      },
      rowKey: {
        type: Function,
        required: (row, rowIndex) => rowIndex
      },
      rowSelection: Object,
      group: Boolean
    },
    data () {
      return {
        columnsWidth: [],
        tableFixedHeight: undefined,
        tableWidth: undefined,
        showVerticalScrollBar: false,
        showHorizontalScrollBar: false
      }
    },
    components: {
      TableHead,
      TableBody
    },
    computed: {
      groupList () {
        if (this.group) {
          return this.data
        }
        return [{ productList: this.data }]
      },
      fullColumns () {
        if (this.rowSelection) {
          return [{
            ...this.rowSelection,
            type: 'selection'
          }, ...this.columns]
        }
        return this.columns
      },
      isEmpty () {
        return !this.loading && this.data.length <= 0
      },
      selfShowHeader () {
        if (this.data.length > 0) {
          return this.showHeader
        }
        return false
      },
      headStyles () {
        if (!this.tableWidth) {
          return {}
        }
        let width = this.border ? this.tableWidth + 1 : this.tableWidth
        width += this.showVerticalScrollBar ? this.scrollBarWidth : 0
        return {
          width: `${width}px`
        }
      },
      tbodyContainerStyles () {
        const style = {
          height: `${this.tableFixedHeight}px`
        }
        if (this.tableWidth) {
          let width = this.border ? this.tableWidth + 1 : this.tableWidth
          width += this.showVerticalScrollBar ? this.scrollBarWidth : 0
          style.width = `${width}px`
        }
        return style
      },
      bodyStyles () {
        if (!this.tableWidth) {
          return {}
        }
        const width = this.border ? this.tableWidth + 1 : this.tableWidth
        return {
          width: `${width}px`
        }
      }
    },
    created () {
      this.scrollBarWidth = getScrollBarSize() || 0
    },
    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
    },
    watch: {
      data () {
        this.handleResize()
      }
    },
    methods: {
      handleSelect (selectedRowKeys, row) {
        this.$emit('on-select', selectedRowKeys, row)
      },
      handleSelectAll (selected) {
        this.$emit('on-select-all', { selected })
      },
      getSpan (row, column, rowIndex, columnIndex) {
        let rowspan = 1
        let colspan = 1
        if (isFunction(this.spanMethod)) {
          const result = this.spanMethod({ row, column, rowIndex, columnIndex })
          if (isArray(result)) {
            rowspan = result[0]
            colspan = result[1]
          } else if (isObject(result)) {
            rowspan = result.rowspan
            colspan = result.colspan
          }
        }
        return { rowspan, colspan }
      },
      getCellStyle (col) {
        return {
          'text-align': col.align || 'left'
        }
      },
      setHeadCellWidth (column, index) {
        let width = this.setCellWidth(column, index)
        if (width && index === this.fullColumns.length - 1) {
          width += this.showVerticalScrollBar ? this.scrollBarWidth : 0
        }
        return width
      },
      setCellWidth (column, index) {
        let width = ''
        if (column.width) {
          width = column.width
        } else if (this.columnsWidth[index]) {
          width = this.columnsWidth[index].width
        } else if (column.minWidth) {
          width = column.minWidth
        }
        if (width === '0') {
          width = ''
        }
        return width || ''
      },
      setVerticalScrollBar () {
        const $conatiner = this.$refs.tbodyContainer
        const $tbody = this.$refs.tbody
        if (!$conatiner || !$tbody || !this.data || this.data.length === 0) {
          this.showVerticalScrollBar = false
          return
        }
        this.showVerticalScrollBar = $conatiner.offsetHeight < $tbody.scrollHeight
      },
      setHorizontalScrollBar () {
        const $container = this.$refs.container
        const $table = this.$refs.table
        if (!$container || !$table || !this.data || this.data.length === 0) {
          this.showHorizontalScrollBar = false
          return
        }
        this.showHorizontalScrollBar = $container.offsetWidth < $table.scrollWidth
      },
      async handleResize () {
        this.setHorizontalScrollBar()
        try {
          await this.getTableFixedHeight()
        } catch (err) {
          console.error(err)
        }
        this.setVerticalScrollBar()
        this.getTableColumnsWidth()
      },
      handlePageChange (pagination) {
        this.scrollTop()
        this.$emit('on-page-change', pagination)
      },
      getTableFixedHeight () {
        return new Promise((resolve) => {
          this.$nextTick(() => {
            if (this.data.length > 0 && this.tableFixed) {
              const $container = this.$refs.container
              const $pagination = this.$refs.pagination
              const $table = this.$refs.tbodyContainer
              if ($container && $table) {
                let height = $container.offsetHeight
                const { top: containerTop } = $container.getBoundingClientRect()
                const { top } = $table.getBoundingClientRect()
                height = height - (top - containerTop)
                if ($pagination) {
                  height = height - $pagination.$el.offsetHeight
                }
                height -= this.showHorizontalScrollBar ? this.scrollBarWidth : 0
                this.tableFixedHeight = height
                this.$nextTick(resolve)
              }
            }
            resolve()
          })
        })
      },
      getTableColumnsWidth () {
        const tableWidth = this.$el.offsetWidth

        let usableWidth = tableWidth - (this.border ? 1 : 0)
        usableWidth -= this.showVerticalScrollBar ? this.scrollBarWidth : 0
        let usableLength = 0
        const noMaxWidthColumns = []
        let widthList = []
        let columnWidth = 0
        this.fullColumns.forEach((col, i) => {
          if (col.width) {
            usableWidth -= col.width
          } else {
            usableLength += 1
            if (col.minWidth) {
              usableWidth -= col.minWidth
            }
            if (!col.maxWidth) {
              noMaxWidthColumns.push({ column: col, index: i })
            }
          }
        })

        if (usableWidth > 0 && usableLength > 0) {
          columnWidth = parseInt(usableWidth / usableLength)
        }

        this.fullColumns.forEach((column, i) => {
          let width = columnWidth + (column.minWidth || 0)
          if (column.width) {
            width = column.width
          } else {
            if (column.minWidth > width) {
              width = column.minWidth
            } else if (column.maxWidth < width) {
              width = column.maxWidth
            }

            columnWidth = 0

            if (usableWidth > 0) {
              usableWidth -= width - (column.minWidth || 0)
              usableLength--
              if (usableLength > 0) {
                columnWidth = parseInt(usableWidth / usableLength)
              }
            }
          }
          widthList[i] = { width }
        })

        if (usableWidth > 0) {
          usableLength = noMaxWidthColumns.length
          columnWidth = parseInt(usableLength / usableLength)
          noMaxWidthColumns.forEach(({ column, index }) => {
            const width = widthList[index] + columnWidth
            if (usableLength > 1) {
              usableLength--
              usableWidth -= columnWidth
              columnWidth = parseInt(usableWidth / usableLength)
            } else {
              columnWidth = 0
            }
            widthList[index] = { width }
          })
        }

        this.columnsWidth = widthList

        this.tableWidth = widthList.reduce((prev, next) => prev + next.width, 0)
      },
      scrollTop () {
        const $body = this.$refs.tbodyContainer
        if ($body) {
          $body.scrollTop = 0
        }
      }
    }
  }
</script>
<style lang="less">
  @import '~@/styles/common.less';
  .quick-edit-product-table-container {
    height: 100%;
    overflow: auto;
    position: relative;
    background: @component-bg;
    .table {
      overflow-y: hidden;
      overflow-x: auto;
      &.is-border {
        .table-head  {
          table {
            border-top: 1px solid #E9EAF2;
            border-left: 1px solid #E9EAF2;
          }
          th {
            padding: 14px 8px;
            background: #F7F8FA;
            font-size: 14px;
            font-weight: normal;
            color: #A2A4B3;
          }
          .table-th-required::after {
            .required-chart()
          }
        }
        .table-body {
          overflow-y: auto;
          table {
            border-left: 1px solid #E9EAF2;
          }
          tbody:hover {
            background: #FFF9F0;
          }
          td {
            padding: 16px 8px;
          }
          .row-bottom-container td {
            padding: 0;
            border: none;
          }
        }

        table {
          table-layout: fixed;
          width: 100%;
        }
        th, td {
          border-right: 1px solid #E9EAF2;
          border-bottom: 1px solid #E9EAF2;
          .table-selection-checkbox.boo-checkbox-wrapper {
            &, .boo-checkbox {
              margin-right: 0px;
            }
          }
        }
      }
    }
    .pagination {
      text-align: right;
      padding: 16px 24px;
    }
  }
</style>
