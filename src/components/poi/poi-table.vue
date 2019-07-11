<template>
  <Table
    class="poi-table"
    ref="table"
    :data="data"
    :columns="cols"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template slot="footer">
      <slot name="footer">
        <Page v-bind="pagination" v-on="$listeners" />
      </slot>
    </template>
  </Table>
</template>

<script>
  const DEFAULT_POI_COLUMNS = [
    {
      title: '门店ID',
      key: 'id'
    }, {
      title: '门店名称',
      key: 'name'
    }, {
      title: '门店地址',
      key: 'address'
    }
  ]
  export default {
    name: 'PoiTable',
    props: {
      data: Array,
      columns: {
        type: Array,
        default: () => DEFAULT_POI_COLUMNS
      },
      checkable: {
        type: Boolean,
        default: true
      },
      total: {
        type: Number,
        default: 0
      },
      current: {
        type: Number,
        default: 1
      },
      pageOptions: Object
    },
    computed: {
      cols () {
        if (this.checkable && !this.columns.find(col => col.type === 'selection')) {
          return [].concat([{
            type: 'selection',
            width: 60,
            align: 'center'
          }], this.columns)
        }
        return this.columns
      },
      pagination () {
        return {
          pageSize: 20,
          pageSizeOpts: [20, 50, 100],
          showSizer: true,
          ...(this.pageOptions || {}),
          total: this.total,
          current: this.current
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .poi-table {
    /deep/ .boo-table-footer {
      height: auto;
      min-height: 50px;
      line-height: 50px;
      padding-left: 20px;
      border-bottom: 1px solid @border-color-base;
    }
  }
</style>
