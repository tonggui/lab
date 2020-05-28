import Vue from 'vue'

export default Vue.extend({
  props: {
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleSelectAll (value) {
      this.$emit('on-select-all', value)
    }
  },
  render (h) {
    if (this.column.type === 'selection') {
      return h('Checkbox', {
        class: 'table-selection-checkbox',
        on: {
          'on-change': this.handleSelectAll
        }
      })
    }
    if (!this.column.renderHeader) {
      return h('div', {
        class: {
          'table-th-required': this.column.required
        }
      }, [this.column.title])
    }
    return this.column.renderHeader(h, { column: this.column, columnIndex: this.columnIndex })
  }
})
