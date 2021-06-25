<template>
  <div>
    <BatchEntrance :router-tag-id="routerTagId" />
    <ProductRelate />
    <BatchRelTaskResult />
    <NavigatorBar />
    <div v-if="merchantCubeSwitch">
      魔方入口 <a @click="$router.push({ name: 'merchantCubeList' })">进入</a>
    </div>
  </div>
</template>
<script>
  import BatchEntrance from './components/batch-entrance'
  import NavigatorBar from './components/navigator-bar'
  import BatchRelTaskResult from '@/views/merchant/batch-management/new-batch-rel/container/batch-rel-task-result'
  import ProductRelate from '../../container/product-relate'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    MERCHANT_CUBE_SWITCH
  } from '@/module/moduleTypes'

  export default {
    name: 'merchant-product-list-header',
    computed: {
      ...mapModule({
        merchantCubeSwitch: MERCHANT_CUBE_SWITCH
      }),
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
