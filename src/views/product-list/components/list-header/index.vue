<template>
  <div class="header">
    <PoiNotice />
    <AlertTip v-if="modules.riskControl" type="error">该门店有原价虚高被平台下架商品，请及时处理</AlertTip>
    <AuditAlert />
    <NavigatorBar class="header-navigator-bar" :disabled="disabled" />
    <HotRecommend v-if="modules.hotRecommend" />
  </div>
</template>

<script>
  import AlertTip from '@components/alert-tip'
  import PoiNotice from './components/poi-notice'
  import AuditAlert from './components/audit-alert'
  import NavigatorBar from './components/navigator-bar'
  import HotRecommend from './components/hot-recommend'

  export default {
    name: 'product-list-header',
    props: {
      disabled: Boolean,
      modules: {
        type: Object,
        default: () => ({
          hotRecommend: false,
          riskControl: false
        })
      }
    },
    components: {
      PoiNotice,
      AuditAlert,
      AlertTip,
      NavigatorBar,
      HotRecommend
    }
  }
</script>
<style lang="less">
  .header-navigator-bar {
    margin: 10px 0;
  }
</style>
