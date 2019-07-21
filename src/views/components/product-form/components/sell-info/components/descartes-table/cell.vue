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
        this.$emit('on-change', {
          ...this.data,
          [this.col.id]: v
        })
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
      const newNode = cloneElement(node, {
        props: {
          value: this.data[this.col.id],
          disabled: this.col.id !== 'editable' && !this.data.editable
        },
        on: {
          'input': this.handleChange
        }
      })
      return newNode
    }
  }
</script>
