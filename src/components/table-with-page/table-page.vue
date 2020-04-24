<!--<template>
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
      :border="border"
      class="table-with-page-table"
      :class="{ 'is-border': border }"
      ref="table"
      no-data-text=""
      :show-header="selfShowHeader"
      :height="tableHeight"
      v-show="!isEmpty"
    >
      <template v-for="slot in slots">
        <template v-slot:[slot.name]="props">
          {{ slot.render(props) }}
        </template>
      </template>
    <Table>
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
</template>-->
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
      tableFixed: Boolean,
      needScrollTop: Boolean,
      border: {
        type: Boolean,
        default: false
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
        return !this.loading && this.dataSource.length <= 0
      },
      selfShowHeader () {
        if (this.dataSource.length > 0) {
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
      },
      loading (loading) {
        if (loading && this.needScrollTop) {
          this.scrollToTop()
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
      scrollToTop () {
        if (!this.tableFixed) {
          return
        }
        // 内部滚动
        const $table = this.$refs.table
        if (!$table) {
          return
        }
        const $body = $table.$refs.body
        if (!$body) {
          return
        }
        $body.scrollTop = 0
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
              height = height - (top - containerTop)
              if ($pagination) {
                height = height - $pagination.$el.offsetHeight
              }
              this.tableFixedHeight = height
            }
          }
        })
      },
      renderEmpty (h) {
        if (this.$slots.empty) {
          return [this.$slots.empty]
        }
        if (this.$scopedSlots.empty) {
          return [this.$scopedSlots.empty()]
        }
        return [h('Empty', {
          props: {
            description: this.noDataText || '暂无数据'
          }
        })]
      },
      renderHeader (h) {
        let node
        if (this.$slots.header) {
          node = this.$slots.header
        } else if (this.$scopedSlots.header) {
          node = this.$scopedSlots.header()
        }
        return h('div', {
          directives: [{
            name: 'show',
            value: !this.isEmpty
          }]
        }, [node])
      },
      renderTable (h) {
        const { header, empty, ...rest } = this.$scopedSlots
        return h('Table', {
          class: {
            'table-with-page-table': true,
            'is-border': this.border
          },
          directives: [{
            name: 'show',
            value: !this.isEmpty
          }],
          props: {
            columns: this.columns,
            data: this.dataSource,
            border: this.border,
            noDataText: '',
            showHeader: this.selfShowHeader,
            height: this.tableHeight
          },
          on: this.$listeners,
          attrs: this.$attrs,
          ref: 'table',
          scopedSlots: rest
        })
      },
      renderPagination (h) {
        const pagination = h('Pagination', {
          class: 'table-with-page-page',
          props: {
            pagination: this.pagination
          },
          on: {
            'on-change': this.handlePageChange
          },
          ref: 'pagination'
        })
        return h('div', {
          directives: [{
            name: 'show',
            value: this.dataSource.length > 0
          }]
        }, [this.pagination ? pagination : null])
      },
      renderContent (h) {
        if (this.isEmpty) {
          return this.renderEmpty(h)
        }

        const header = this.renderHeader(h)
        const table = this.renderTable(h)
        const pagination = this.renderPagination(h)

        const loading = this.loading ? h('Loading') : null
        return [header, table, pagination, loading]
      }
    },
    render (h) {
      return h('div', {
        class: {
          'table-with-page': true,
          fixed: this.tableFixed
        },
        ref: 'container'
      }, this.renderContent(h))
    }
  }
</script>
<style lang="less">
  @border: 1px solid #E8E8E8;
  .table-with-page {
    position: relative;
    min-height: 100%;
    &.fixed {
      height: 100%;
      overflow: hidden;
    }
    &-table {
      border: none;
      /deep/ .boo-table {
        &::before, &::after {
          display: none;
        }
        th, td {
          border-bottom: @border;
        }
      }
      &.is-border /deep/ .boo-table {
        .boo-table-body,
        .boo-table-header {
          table {
            border-left: @border;
          }
        }
        th {
          border-top: @border;
        }
        th, td {
          border-right: @border;
        }
      }
    }
    &-page {
      text-align: right;
      padding: 30px 20px;
    }
  }
</style>
