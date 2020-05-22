<template>
  <div>
    <HotRecommend v-if="showHotRecommend" />
    <ProductCube v-else-if="showProductCube" />
    <span v-else>快去新建商品吧~</span>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import HotRecommend from './hot-recommend'
  import ProductCube from './product-cube'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    POI_HOT_RECOMMEND, POI_PRODUCT_CUBE_ENTRANCE
  } from '@/module/moduleTypes'

  const { mapGetters } = createNamespacedHelpers('productList')
  export default {
    name: 'product-empty',
    computed: {
      ...mapGetters(['totalProductCount']),
      ...mapModule({
        supportHotRecommend: POI_HOT_RECOMMEND,
        supportProductCube: POI_PRODUCT_CUBE_ENTRANCE
      }),
      showHotRecommend () {
        return this.totalProductCount <= 5 && this.supportHotRecommend
      },
      showProductCube () {
        return this.totalProductCount === 0 && this.supportProductCube
      }
    },
    components: {
      HotRecommend,
      ProductCube
    }
  }
</script>
