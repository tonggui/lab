<template>
  <div class="table-with-page">
    <Table
      :columns="columns"
      :data="data"
      v-on="listeners"
      v-bind="$attrs"
      class="table-with-page-table"
      ref="table"
    ></Table>
    <Page
      v-if="!!pagination"
      v-bind="page"
      @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange"
      class="table-with-page-page"
    ></Page>
  </div>
</template>
<script>
  export default {
    name: 'table-with-page',
    props: {
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
      }
    },
    computed: {
      listeners () {
        const { change, ...rest } = this.$listeners
        return rest
      },
      page () {
        return {
          pageSizeOpts: [20, 50, 100],
          ...this.pagination
        }
      }
    },
    methods: {
      handlePageChange (current) {
        return this.$emit('on-page-change', { ...this.pagination, current })
      },
      handlePageSizeChange (pageSize) {
        const { current, total } = this.pagination
        let num = current
        if (current * pageSize > total) {
          num = Math.floor(total / pageSize) + 1
        }
        return this.$emit('on-page-change', { ...this.pagination, pageSize, current: num })
      },
      selectAll (status) {
        this.$refs.table.selectAll(status)
      }
    }
  }
</script>
<style lang="less">
  .table-with-page {
    height: 100%;
    &-table {
      border: none;
    }
    &-page {
      text-align: right;
      padding: 30px 20px;
    }
  }
</style>
