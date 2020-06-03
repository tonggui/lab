import Vue from 'vue'

export default Vue.extend({
  props: {
    row: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    skuIndex: {
      type: Number,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  render (h) {
    if (!this.column.render) {
      return h('div', this.row[this.column.key])
    }
    return this.column.render(h, { row: this.row, skuIndex: this.skuIndex, columnIndex: this.columnIndex })
  }
})
