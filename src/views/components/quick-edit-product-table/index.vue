<script>
  import Table from './components/table'
  import Column from './column'
  import { TYPE } from './constants'

  export default {
    name: 'quick-edit-product-table',
    props: {
      loading: Boolean,
      type: {
        type: String,
        required: true,
        validator: (type) => {
          return Object.values(TYPE).includes(type)
        }
      },
      data: {
        type: Array,
        default: () => []
      },
      columns: {
        type: Array,
        default: () => []
      },
      modules: {
        type: Object,
        default: () => ({})
      },
      pagination: Object,
      rowKey: Function,
      rowSelection: Object,
      group: Boolean,
      hasPermission: Boolean
    },
    components: {
      Column,
      Table
    },
    methods: {
      handlePageChange (page) {
        this.$emit('on-page-change', page)
      },
      handleSpan ({ row, column, rowIndex }) {
        if (column.dimension === 'spu') {
          const { skuList } = row
          if (rowIndex === 0) {
            return [skuList.length, 1]
          }
          return [0, 0]
        }
        return [1, 1]
      },
      handleSelect (...rest) {
        this.$emit('on-select', ...rest)
      },
      handleSelectAll (...rest) {
        this.$emit('on-select-all', ...rest)
      },
      scrollTop () {
        this.$refs.table.scrollTop()
      },
      renderTable (h, { columns }) {
        return h(Table, {
          props: {
            // columns合并
            columns: [...columns, ...this.columns],
            data: this.data,
            pagination: this.pagination,
            border: true,
            spanMethod: this.handleSpan,
            rowSelection: this.rowSelection,
            rowKey: this.rowKey,
            group: this.group,
            loading: this.loading
          },
          attrs: { ...this.$attrs },
          on: {
            'on-page-change': this.handlePageChange,
            'on-select': this.handleSelect,
            'on-select-all': this.handleSelectAll
          },
          scopedSlots: { ...this.$scopedSlots },
          ref: 'table'
        })
      }
    },
    render (h) {
      return h(Column, {
        props: {
          type: this.type,
          hasPermission: this.hasPermission,
          modules: this.modules
        },
        on: {
          'modify-product': this.$listeners['modify-product'],
          'modify-sku': this.$listeners['modify-sku']
        },
        scopedSlots: {
          default: ({ columns }) => this.renderTable(h, { columns })
        }
      })
    }
  }
</script>
