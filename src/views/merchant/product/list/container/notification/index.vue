<template>
  <div>
    <ProductRelate />
    <BatchRelTaskResult />
    <MerchantCenterCubeNotification />
  </div>
</template>

<script>
  import BatchRelTaskResult from '@/views/merchant/batch-management/new-batch-rel/container/batch-rel-task-result'
  import ProductRelate from '../product-relate'
  import MerchantCenterCubeNotification from '@/views/merchant/cube/merchant-center-cube-notification'

  export default {
    name: 'notification',
    components: {
      BatchRelTaskResult,
      ProductRelate,
      MerchantCenterCubeNotification
    }
  }
</script>

<style scoped>

</style>
