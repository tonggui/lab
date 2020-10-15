<template>
  <div>
    <BreadcrumbHeader>
        门店商品管理
    </BreadcrumbHeader>
    <Container />
  </div>
</template>
<script>
  import { helper } from './store'
  import BreadcrumbHeader from '../../components/breadcrumb-header'
  import Container from './container'

  const { mapGetters, mapActions } = helper()

  export default {
    name: 'multi-store-product-list-page',
    computed: {
      ...mapGetters(['sorting'])
    },
    methods: {
      ...mapActions(['setSorting', 'getData', 'destroy'])
    },
    components: {
      BreadcrumbHeader,
      Container
    },
    mounted () {
      this.getData()
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
</style>
