<script>
  import create from './create'
  import { isFunction } from 'lodash'

  export default {
    name: 'category-attrs-container',
    created () {
      this.component = create()
    },
    methods: {
      validate () {
        console.log('categoryAttrValidate')
        const $component = this.$refs.component
        if ($component && isFunction($component.validate)) {
          return $component.validate()
        }
      }
    },
    render (h) {
      return h(this.component, {
        ref: 'component',
        attrs: { ...this.$attrs },
        on: { ...this.$listeners }
      })
    }
  }
</script>
