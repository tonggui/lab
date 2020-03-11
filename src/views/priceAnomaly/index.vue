<template>
  <div class="product-price-anomaly">
    <BreadcrumbHeader>价格预警</BreadcrumbHeader>
    <Alert type="error" class="warning">
      <Icon type="error-outline" size="17" color="red" /> 请及时核对您的商品与价格是否对应，避免您的损失
    </Alert>

    <AnomalyList :anomaly-type="PROBLEM_TYPE.PRICE_ANOMALY" />
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/components/breadcrumb-header'
  import AnomalyList from '@/views/components/anomaly-list'
  import { PROBLEM_TYPE } from '@/views/monitor/constants'

  export default {
    name: 'price-anomaly',
    components: {
      BreadcrumbHeader,
      AnomalyList
    },
    data () {
      return {
        PROBLEM_TYPE
      }
    },
    created () {}
  }
</script>

<style lang='less'>
.product-price-anomaly {
  .warning {
    border: none;
    line-height: 34px;
    margin: 0;
  }
}
</style>
