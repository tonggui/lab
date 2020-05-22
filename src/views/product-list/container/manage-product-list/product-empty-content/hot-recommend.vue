<template>
  <div>
    <div>快去新建商品吧~</div>
    <div>根据您经营的品类，为您推荐了必建商品可快速新建多个商品！</div>
    <NamedLink :name="hotRecommendPage" tag="a">
      <Button type="primary">新店必建商品</Button>
    </NamedLink>
  </div>
</template>
<script>
  import NamedLink from '@/components/link/named-link'
  import hotRecommendPage from '@sgfe/eproduct/navigator/pages/product/hotRecommend'

  export default {
    name: 'product-empty-hot-recommend',
    computed: {
      hotRecommendPage () {
        return hotRecommendPage.name
      }
    },
    components: { NamedLink }
  }
</script>
