<template>
  <div class="table-with-page">
    <div v-show="!isEmpty">
      <slot name="header"></slot>
    </div>
    <Table
      :columns="columns"
      :data="dataSource"
      v-on="$listeners"
      v-bind="$attrs"
      class="table-with-page-table"
      ref="table"
      no-data-text=""
      v-show="!isEmpty"
      :show-header="selfShowheader"
    >
    </Table>
    <Pagination
      v-if="showPagination"
      :pagination="pagination"
      @on-change="handlePageChange"
      class="table-with-page-page"
    />
    <slot name="empty" v-if="isEmpty">
      <Empty :description="noDataText || '暂无数据'" />
    </slot>
    <Loading v-if="loading" />
  </div>
</template>
<script>
  import Loading from '@components/loading'

  export default {
    name: 'table-with-page',
    props: {
      loading: Boolean,
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Object,
        default: null
      },
      disabled: Boolean,
      noDataText: String,
      showHeader: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      dataSource () {
        if (this.disabled) {
          return this.data.map(d => ({ ...d, _disabled: true }))
        }
        return this.data
      },
      isEmpty () {
        return !this.loading && this.data.length <= 0
      },
      showPagination () {
        return !!this.pagination && this.data.length > 0
      },
      selfShowheader () {
        if (!this.loading) {
          return this.showHeader
        }
        return false
      }
    },
    components: {
      Loading
    },
    methods: {
      handlePageChange (pagination) {
        this.$emit('on-page-change', pagination)
      },
      selectAll (status) {
        this.$refs.table.selectAll(status)
      }
    }
  }
</script>
<style lang="less">
  .table-with-page {
    position: relative;
    min-height: 100%;
    &-table {
      border: none;
    }
    &-page {
      text-align: right;
      padding: 30px 20px;
    }
  }
</style>
