<template>
  <div>
    <ListHeader class="header" />
    <SortProductList v-if="sorting" @close-sort="setSorting(false)" />
    <ManageProductList v-else @open-sort="setSorting(true)" />
  </div>
</template>
<script>
  import { helper } from './store'
  import ListHeader from './components/list-header/index'
  import SortProductList from './container/sort-product-list'
  import ManageProductList from './container/manage-product-list'
  import { triggerTour } from './merchant-tour'
  import { triggerToast } from '../../cube/utils'

  const { mapGetters, mapActions } = helper()

  export default {
    name: 'merchant-product-list-page',
    computed: {
      ...mapGetters(['sorting'])
    },
    methods: {
      ...mapActions(['setSorting', 'getData', 'destroy'])
    },
    components: {
      ListHeader,
      SortProductList,
      ManageProductList
    },
    mounted () {
      this.getData()
      triggerToast()
      triggerTour()
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
