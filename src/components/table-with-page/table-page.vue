<template>
  <div class="table-with-page" ref="container">
    <template v-if="isEmpty">
      <slot name="empty">
        <Empty :description="noDataText || '暂无数据'" />
      </slot>
    </template>
    <div v-show="!isEmpty"><slot name="header"></slot></div>
    <Table
      :columns="columns"
      :data="dataSource"
      v-on="$listeners"
      v-bind="$attrs"
      class="table-with-page-table"
      ref="table"
      no-data-text=""
      :show-header="selfShowHeader"
      :height="tableHeight"
      v-show="!isEmpty"
    />
    <div v-show="dataSource.length > 0">
      <Pagination
        v-if="pagination"
        :pagination="pagination"
        @on-change="handlePageChange"
        class="table-with-page-page"
        ref="pagination"
      />
    </div>
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
      },
      height: Number,
      tableFixed: Boolean
    },
    computed: {
      dataSource () {
        if (this.disabled) {
          return this.data.map(d => ({ ...d, _disabled: true }))
        }
        return this.data
      },
      isEmpty () {
        return !this.loading && this.dataSource.length <= 0
      },
      selfShowHeader () {
        if (!this.loading && this.dataSource.length > 0) {
          return this.showHeader
        }
        return false
      },
      tableHeight () {
        if (this.tableFixed) {
          return this.tableFixedHeight
        }
        return this.height
      }
    },
    components: {
      Loading
    },
    data () {
      return {
        tableFixedHeight: undefined
      }
    },
    mounted () {
      this.getTableFixedHeight()
    },
    watch: {
      dataSource () {
        if (this.tableFixedHeight === undefined) {
          this.getTableFixedHeight()
        }
      }
    },
    methods: {
      handlePageChange (pagination) {
        this.$emit('on-page-change', pagination)
      },
      selectAll (status) {
        this.$refs.table.selectAll(status)
      },
      getTableFixedHeight () {
        this.$nextTick(() => {
          if (this.dataSource.length > 0 && this.tableFixed) {
            const $container = this.$refs.container
            const $pagination = this.$refs.pagination
            const $table = this.$refs.table
            if ($container && $table) {
              let height = $container.offsetHeight
              const { top: containerTop } = $container.getBoundingClientRect()
              const { top } = $table.$el.getBoundingClientRect()
              height = height - (containerTop - top)
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
