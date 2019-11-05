<template>
  <Table
    class="poi-table"
    ref="table"
    :data="poiList"
    :columns="cols"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template slot="footer" v-bind:pagination="pagination">
      <slot name="footer">
        <Pagination
          :pagination="pagination"
          @on-change="handlePageChange"
        />
        <div class="footer-extras">
          <slot name="footer-extras" />
        </div>
      </slot>
    </template>
  </Table>
</template>

<script>
  const DEFAULT_POI_COLUMNS = [
    {
      title: '门店ID',
      align: 'left',
      key: 'id'
    }, {
      title: '门店名称',
      align: 'left',
      key: 'name'
    }, {
      title: '门店地址',
      align: 'left',
      key: 'address'
    }
  ]
  export default {
    name: 'PoiTable',
    props: {
      columns: {
        type: Array,
        default: () => DEFAULT_POI_COLUMNS
      },
      checkable: {
        type: Boolean,
        default: true
      },
      checkedIds: Array,
      disabledIds: Array,
      total: {
        type: Number,
        default: 0
      },
      current: {
        type: Number,
        default: 1
      },
      pageOptions: Object,
      query: Object,
      fetchData: Function
    },
    data () {
      return {
        data: [],
        showFooterExtras: false,
        pagination: {
          pageSize: 20,
          showSizer: true,
          ...(this.pageOptions || {}),
          total: this.total,
          current: this.current
        }
      }
    },
    computed: {
      cols () {
        if (this.checkable && !this.columns.find(col => col.type === 'selection')) {
          return [].concat([{
            type: 'selection',
            width: 50,
            align: 'left'
          }], this.columns)
        }
        return this.columns
      },
      poiList () {
        return this.data.map(poi => {
          if (this.checkedIds) {
            poi._checked = this.checkedIds.includes(poi.id)
          } else {
            poi._checked = false
          }

          if (this.disabledIds) {
            poi._disabled = this.disabledIds.includes(poi.id)
          } else {
            poi._disabled = false
          }

          return poi
        })
      }
    },
    watch: {
      total (v) {
        this.pagination.total = v
      },
      current (v) {
        this.pagination.current = v
      },
      pageOptions (opts) {
        this.pagination = {
          ...this.pagination,
          ...(opts || {})
        }
      }
    },
    methods: {
      getSelection () {
        return this.$refs.table.getSelection()
      },
      selectAll (select) {
        return this.$refs.table.selectAll(!!select)
      },
      getCheckedPois (filter = true) {
        let checkedPois = this.getSelection()

        if (filter && this.disabledIds && this.disabledIds.length) {
          const filterIds = this.disabledIds
          checkedPois = checkedPois.filter(poi => !filterIds.includes(poi.id))
        }

        return checkedPois
      },
      handlePageChange (pagination) {
        this.pagination = pagination
        this.search()
      },
      // handlePageSizeChange (pageSize) {
      //   this.pagination.pageSize = pageSize
      //   this.search()
      // },
      async search () {
        try {
          const { list, pagination } = await this.fetchData({
            ...(this.query || {}),
            pagination: {
              current: this.pagination.current,
              pageSize: this.pagination.pageSize
            }
          })
          this.data = list
          this.pagination = { ...this.pagination, ...pagination }
          this.$emit('on-change', this.data, this.pagination)
        } catch (e) {
          this.$Message.error(e.message || e)
        }
      }
    },
    created () {
      this.showFooterExtras = !!this.$slots['footer-extras']
    },
    mounted () {
      this.search()
    }
  }
</script>

<style lang="less" scoped>
  .poi-table {
    /deep/ .boo-table {
      .boo-table-cell {
        padding: 10px 16px;
      }
      .boo-table-header {
        thead {
          .boo-table-cell.boo-table-cell-with-selection {
            input.boo-checkbox-input, .boo-checkbox-inner {
              display: none;
            }
          }
        }
      }
      td {
        vertical-align: baseline;
        border-bottom: none;
      }
    }
    /deep/ .boo-table-footer {
      height: auto;
      margin-top: -1px;
      min-height: 50px;
      padding: 0 16px 16px 16px;
      border-bottom: 1px solid @border-color-base;

      display: flex;

      .boo-page {
        flex: 1;
      }
    }
  }
</style>
