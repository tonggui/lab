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
      const rowDisabled = this.col.id !== 'editable' && !this.data.editable // 每条信息的disabled状态
      const columnDisabled = this.col.disabled // 每列信息自定义的disabled状态
      const newNode = cloneElement(node, {
        props: {
          value: this.data[this.col.id],
          disabled: rowDisabled || columnDisabled
        },
        on: {
          'input': this.handleChange
        }
      })
      return newNode
    }
  }
</script>
