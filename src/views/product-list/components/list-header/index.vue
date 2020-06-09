<template>
  <div class="header">
    <PoiNotice />
    <AlertTip v-if="showRiskControl" type="error">该门店有原价虚高被平台下架商品，请及时处理</AlertTip>
    <NavigatorBar class="header-navigator-bar" :disabled="disabled" :tag-id="context.tagId" />
    <HotRecommend v-if="showHotRecommend" />
    <AuditAlert :totalProductCount="context.totalProductCount" />
    <ProductCube v-if="supportProductCube" :totalProductCount="context.totalProductCount" />
  </div>
</template>

<script>
  import { isFinite } from 'lodash'
  import AlertTip from '@components/alert-tip'
  import PoiNotice from './components/poi-notice'
  import AuditAlert from './components/audit-alert'
  import NavigatorBar from './components/navigator-bar'
  import HotRecommend from './components/hot-recommend'
  import ProductCube from './components/product-cube'
  import {
    POI_RISK_CONTROL,
    POI_HOT_RECOMMEND,
    POI_PRODUCT_CUBE_ENTRANCE
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'product-list-header',
    props: {
      disabled: Boolean,
      context: {
        type: Object,
        default: () => ({
          totalProductCount: undefined,
          tagId: undefined
        })
      }
    },
    computed: {
      ...mapModule({
        showRiskControl: POI_RISK_CONTROL,
        supportProductCube: POI_PRODUCT_CUBE_ENTRANCE,
        supportHotRecommend: POI_HOT_RECOMMEND
      }),
      // showProductCube () {
      //   const { totalProductCount } = this.context
      //   const limitProductCount = isFinite(totalProductCount) && totalProductCount > 0
      //   return limitProductCount && this.supportProductCube
      // },
      showHotRecommend () {
        const { totalProductCount } = this.context
        const limitProductCount = isFinite(totalProductCount) && totalProductCount <= 5
        return limitProductCount && this.supportHotRecommend
      }
    },
    components: {
      PoiNotice,
      AuditAlert,
      AlertTip,
      NavigatorBar,
      HotRecommend,
      ProductCube
    }
  }
</script>
<style lang="less">
  .header-navigator-bar {
    margin: 0 0 10px 0;
  }
</style>
