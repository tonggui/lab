<template>
  <div>
    <ProductRel
      isBusinessClient
      :routerTagId="routerTagId"
    />
    <BatchFooter
      :submitting="submitting"
      confirm-text="开始关联"
    />
  </div>
</template>

<script>
  import ProductRel from './components/product-rel'
  import BatchFooter from '@/views/batch-management/components/footer'

  export default {
    name: 'MerchantBatchRel',
    components: {
      ProductRel,
      BatchFooter
    },
    props: {
      routerTagId: [Number, String]
    },
    data () {
      return {
        submitting: false
      }
    }
  }
</script>

<style scoped lang="less">

</style>
