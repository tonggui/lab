<script>
  import { cloneElement } from '@/common/vnode'

  export default {
    name: 'descartes-table-cell',
    props: {
      col: {
        type: Object,
        required: true
      },
      data: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    },
    methods: {
      handleChange (v) {
        const newData = { ...this.data }
        if (Array.isArray(this.col.id)) {
          this.col.id.forEach((k, i) => {
            newData[k] = v[i]
          })
        } else {
          newData[this.col.id] = v
        }
        this.$emit('on-change', newData)
      }
    },
    render (h) {
      const node = this.col.render(h, {
        row: this.data,
        index: this.index
      })
      const { editable = true } = this.col
      if (!editable) {
        return node
      }
      const props = {
        value: Array.isArray(this.col.id) ? this.col.id.map(k => this.data[k]) : this.data[this.col.id]
      }
      const rowDisabled = this.col.id !== 'editable' && !this.data.editable
      if (rowDisabled) {
        props.disabled = rowDisabled
      }
      const newNode = cloneElement(node, {
        props,
        on: {
          'input': this.handleChange
        }
      })
      return newNode
    }
  }
</script>
