<template>
  <div class="multi-store-wrap">
    <Container />
  </div>
</template>
<script>
  import { helper } from './store'
  import Container from './container'

  const { mapGetters, mapActions } = helper()

  export default {
    name: 'multi-store-product-list-page',
    computed: {
      ...mapGetters(['sorting'])
    },
    methods: {
      ...mapActions(['setSorting', 'destroy'])
    },
    components: {
      Container
    },
    mounted () {
      // this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
<style lang="less" scoped>
  .header {
    margin-bottom: 10px;
  }
  .multi-store-wrap {
    min-height: 100%;
  }
</style>
