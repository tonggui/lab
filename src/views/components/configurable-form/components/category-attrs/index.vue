<script>
  import create from './create'

  export default {
    name: 'category-attrs-container',
    created () {
      this.component = create()
    },
    render (h) {
      return h(this.component, {
        attrs: { ...this.$attrs },
        on: { ...this.$listeners }
      })
    }
  }
</script>
