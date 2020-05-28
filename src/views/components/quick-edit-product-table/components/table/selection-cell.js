import Vue from 'vue'

export default Vue.extend({
  props: {
    row: {
      type: Object,
      required: true
    },
    rowKey: {
      type: Function,
      required: true
    },
    rowSelection: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleSelect (value) {
      const rowKey = this.rowKey(this.row)
      const selectedRowKeys = this.rowSelection.selectedRowKeys.slice(0)
      if (value) {
        selectedRowKeys.push(rowKey)
      } else {
        const index = selectedRowKeys.indexOf(rowKey)
        selectedRowKeys.splice(index, 1)
      }
      this.$emit('on-select', selectedRowKeys, this.row)
    }
  },
  computed: {
    checked () {
      const rowKey = this.rowKey(this.row)
      return this.rowSelection.selectedRowKeys.includes(rowKey)
    }
  },
  render (h) {
    return h('Checkbox', {
      class: 'table-selection-checkbox',
      props: {
        value: this.checked
      },
      on: {
        'on-change': this.handleSelect
      }
    })
  }
})
