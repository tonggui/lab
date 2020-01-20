<template>
  <component :is="component" v-bind="$attrs" />
</template>
<script>
  import CategoryError from './category-error'
  import DefaultError from './default'

  export default {
    name: 'error-page',
    computed: {
      type () {
        const { type } = this.$route.query
        const valid = ['default', 'category'].includes(type)
        if (valid) {
          return type
        }
        return 'default'
      },
      component () {
        if (this.type === 'category') {
          return CategoryError
        }
        return DefaultError
      }
    },
    components: {
      CategoryError,
      DefaultError
    }
  }
</script>
