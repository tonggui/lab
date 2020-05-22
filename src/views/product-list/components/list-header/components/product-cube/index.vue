<template>
  <ProductCube :title="info.title" :description="info.description" />
</template>
<script>
  import ProductCube from './product-cube'
  import { mapModule } from '@/module/module-manage/vue'
  import { POI_PRODUCT_CUBE_INFO } from '@/module/moduleTypes'

  export default {
    name: 'product-cube-container',
    computed: {
      ...mapModule({
        info: POI_PRODUCT_CUBE_INFO
      })
    },
    components: {
      ProductCube
    }
  }
</script>
