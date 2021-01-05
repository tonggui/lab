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
      emptyShowHeader: {
        type: Boolean,
        default: false
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
      wrapperColumns () {
        return this.columns.map(col => {
          const { required, renderHeader } = col
          if (!required || !!renderHeader) {
            return col
          }
          return {
            ...col,
            renderHeader: (h, { column }) => {
              return h('div', {
                class: 'table-with-page-th-required'
              }, [column.title])
            }
          }
        })
      },
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
      window.addEventListener('resize', this.getTableFixedHeight)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.getTableFixedHeight)
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
            value: !this.isEmpty || this.emptyShowHeader
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
            columns: this.wrapperColumns,
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
        const header = this.renderHeader(h)
        const table = this.renderTable(h)
        const pagination = this.renderPagination(h)
        const loading = this.loading ? h('Loading') : null
        const empty = this.renderEmpty(h)

        if (this.isEmpty) {
          return [header, empty]
        }
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
  @import '~@/styles/common.less';
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
      background: @component-bg;
      text-align: right;
      padding: 30px 20px;
    }
    .table-with-page-th-required::after {
      .required-chart()
    }
  }
</style>
