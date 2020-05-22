<template>
  <div>
    <div style="width: 190px;margin: auto;">{{ info.title }}</div>
    <router-link :to="link" tag="a">
      <Button type="primary">去「新店必建商品」创建</Button>
    </router-link>
  </div>
</template>
<script>
  import { mapModule } from '@/module/module-manage/vue'
  import { POI_PRODUCT_CUBE_INFO } from '@/module/moduleTypes'

  export default {
    name: 'product-empty-product-cube',
    props: {
      description: Array
    },
    computed: {
      ...mapModule({ info: POI_PRODUCT_CUBE_INFO }),
      link () {
        return { name: 'productRecommend', query: this.$route.query }
      }
    }
  }
</script>
