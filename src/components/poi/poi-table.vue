<template>
  <Table
    class="poi-table"
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
  export default {
    name: 'PoiTable',
    props: {
      pagination: Object
    },
    methods: {
      handlePageChange (pagination) {
        this.$emit('paginationChange', pagination)
      },
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
      padding: 8px 16px;
      border-bottom: 1px solid @border-color-base;
      border-top: 1px solid @border-color-base;

      display: flex;

      .boo-page {
        flex: 1;
      }
    }
  }
</style>
