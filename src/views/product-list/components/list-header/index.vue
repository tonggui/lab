<template>
  <div class="header">
    <SellerCenterNotice />
    <PoiNotice />
    <AlertTip v-if="showRiskControl" type="error">该门店有原价虚高被平台下架商品，请及时处理</AlertTip>
    <NavigatorBar
      class="header-navigator-bar"
      :disabled="disabled"
      :tag-id="context.tagId"
      :showNewBatchCreate="showNewBatchCreate"
      />
    <HotRecommend v-if="showHotRecommend" />
    <AuditAlert :totalProductCount="context.totalProductCount" />
    <template v-if="!showNewBatchCreate">
      <ProductNewArrival v-if="newArrivalSwitch.switch" :tips="newArrivalSwitch.tips" />
      <ProductCube v-else-if="supportProductCube" :totalProductCount="context.totalProductCount" />
    </template>
  </div>
</template>

<script>
  import { isFinite } from 'lodash'
  import AlertTip from '@components/alert-tip'
  import PoiNotice from './components/poi-notice'
  import SellerCenterNotice from './components/seller-center-notice'
  import AuditAlert from './components/audit-alert'
  import NavigatorBar from './components/navigator-bar'
  import HotRecommend from './components/hot-recommend'
  import ProductCube from './components/product-cube'
  import ProductNewArrival from './components/product-new-arrival' // 商品上新入口(魔方二期)
  import {
    POI_RISK_CONTROL,
    POI_HOT_RECOMMEND,
    POI_PRODUCT_CUBE_ENTRANCE,
    POI_PRODUCT_NEW_ARRIVAL_SWITCH
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
    data () {
      return {
        showNewBatchCreate: true
      }
    },
    computed: {
      ...mapModule({
        newArrivalSwitch: POI_PRODUCT_NEW_ARRIVAL_SWITCH,
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
      SellerCenterNotice,
      PoiNotice,
      AuditAlert,
      AlertTip,
      NavigatorBar,
      HotRecommend,
      ProductCube,
      ProductNewArrival
    }
  }
</script>
<style lang="less">
  .header-navigator-bar {
    margin: 0 0 10px 0;
  }
</style>
