<template>
  <div>
    <BatchEntrance :router-tag-id="routerTagId" />
    <ProductRelate />
    <BatchRelTaskResult />
    <NavigatorBar />
  </div>
</template>
<script>
  import BatchEntrance from './components/batch-entrance'
  import NavigatorBar from './components/navigator-bar'
  import BatchRelTaskResult from '@/views/merchant/batch-management/new-batch-rel/container/batch-rel-task-result'
  import ProductRelate from '../../container/product-relate'

  export default {
    name: 'merchant-product-list-header',
    computed: {
      routerTagId () {
        return this.$route.query.routerTagId
      }
    },
    components: {
      BatchEntrance,
      NavigatorBar,
      BatchRelTaskResult,
      ProductRelate
    }
  }
</script>
