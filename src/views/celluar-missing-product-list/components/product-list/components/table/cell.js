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
    }
  },
  render (h) {
    if (!this.column.render) {
      return h('div', this.row[this.column.key])
    }
    return this.column.render(h, { row: this.row })
  }
})
