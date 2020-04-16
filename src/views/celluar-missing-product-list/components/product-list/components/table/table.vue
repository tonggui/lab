<template>
  <div class="celluar-missing-product-table-container" ref="container">
    <template v-if="isEmpty">
      <slot name="empty">
        <Empty :description="noDataText || '暂无数据'" />
      </slot>
    </template>
    <div class="table" :class="{ 'is-border': border }">
      <div class="table-head" :style="headStyles">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <colgroup>
            <col v-for="(col, index) in columns" :key="index" :width="setCellWidth(col, index)" />
          </colgroup>
          <thead class="table-head" v-show="selfShowHeader">
            <tr>
              <th v-for="(col, index) in columns" :key="index" :class="col.className">
                <div :style="cellStyle(col)">{{ col.title }}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table-body" ref="table" :style="bodyStyles">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <colgroup>
            <col v-for="(col, index) in columns" :key="index" :width="setCellWidth(col, index)" />
          </colgroup>
          <tbody>
            <tr v-for="(row, rowIndex) in data" :key="rowIndex">
              <template v-for="(col, columnIndex) in columns">
                <table-td :key="columnIndex" :className="col.className" v-bind="getSpan(row, col, rowIndex, columnIndex)">
                  <div :style="cellStyle(col)"><cell :row="row" :column="col" /></div>
                </table-td>
              </template>
            </tr>
          </tbody>
        </table>
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
    <Loading v-if="loading" />
  </div>
</template>
<script>
  import { isFunction, isArray, isObject } from 'lodash'
  import TableTd from './td'
  import Cell from './cell'

  export default {
    name: 'celluar-missing-product-table',
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
      }
    },
    components: {
      Cell,
      TableTd
    },
    data () {
      return {
        columnsWidth: [],
        tableFixedHeight: undefined,
        tableWidth: undefined
      }
    },
    computed: {
      isEmpty () {
        return !this.loading && this.data.length <= 0
      },
      tableHeight () {
        if (this.tableFixed) {
          return this.tableFixedHeight
        }
        return this.height
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
        const width = this.border ? this.tableWidth + 1 : this.tableWidth
        return {
          width: `${width}px`
        }
      },
      bodyStyles () {
        if (!this.tableWidth) {
          return {}
        }
        const width = this.border ? this.tableWidth + 1 : this.tableWidth
        return {
          width: `${width}px`,
          height: `${this.tableFixedHeight}px`
        }
      }
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
      cellStyle (col) {
        return {
          'text-align': col.align || 'left'
        }
      },
      setCellWidth (column, index) {
        let width = ''
        if (column.width) {
          width = column.width
        } else if (this.columnsWidth[index]) {
          width = this.columnsWidth[index].width
        }
        if (width === '0') {
          width = ''
        }
        return width || ''
      },
      handleResize () {
        const tableWidth = this.$el.offsetWidth

        let usableWidth = tableWidth
        let usableLength = 0
        const noMaxWidthColumns = []
        let widthList = []
        let columnWidth = 0
        this.columns.forEach((col, i) => {
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

        this.columns.forEach((column, i) => {
          let width = columnWidth
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
              usableWidth -= width
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

        this.getTableFixedHeight()
      },
      handlePageChange (pagination) {
        this.$emit('on-page-change', pagination)
      },
      getTableFixedHeight () {
        if (this.tableFixedHeight !== undefined) {
          return
        }
        this.$nextTick(() => {
          if (this.data.length > 0 && this.tableFixed) {
            const $container = this.$refs.container
            const $pagination = this.$refs.pagination
            const $table = this.$refs.table
            if ($container && $table) {
              let height = $container.offsetHeight
              const { top: containerTop } = $container.getBoundingClientRect()
              const { top } = $table.getBoundingClientRect()
              height = height - (top - containerTop)
              if ($pagination) {
                height = height - $pagination.$el.offsetHeight
              }
              this.tableFixedHeight = height
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .celluar-missing-product-table-container {
    height: 100%;
    overflow: auto;
    position: relative;
    .table {
      overflow-y: hidden;
      overflow-x: auto;
      &.is-border {
        .table-head th {
          padding: 14px 0;
          background: #F7F8FA;
          font-size: 14px;
          font-weight: normal;
          color: #A2A4B3;
        }
        .table-body td {
          padding: 16px 8px;
        }
        .table-body tr:hover td {
          background: #FFF9F0;
        }

        .table-head {
          border-top: 1px solid #E9EAF2;
          border-left: 1px solid #E9EAF2;
        }

        .table-body {
          overflow-y: auto;
          border-left: 1px solid #E9EAF2;
        }

        table {
          table-layout: fixed;
        }
        th, td {
          border-right: 1px solid #E9EAF2;
          border-bottom: 1px solid #E9EAF2;
        }
      }
    }
    .pagination {
      text-align: right;
      padding: 30px 20px;
    }
  }
</style>
