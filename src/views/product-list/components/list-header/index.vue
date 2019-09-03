<template>
  <div class="header">
    <PoiNotice />
    <AlertTip v-if="riskControl" type="error">该门店有原价虚高被平台下架商品，请及时处理</AlertTip>
    <AuditAlert />
    <p>TODO: NavigatorBar功能不完善  缺少下载商品 包装袋配置</p>
    <NavigatorBar class="header-navigator-bar" />
    <HotRecommend v-if="isNewPoiRecommend" />
  </div>
</template>

<script>
  import AlertTip from '@components/alert-tip'
  import PoiNotice from './components/poi-notice'
  import AuditAlert from './components/audit-alert'
  import NavigatorBar from './components/navigator-bar'
  import HotRecommend from './components/hot-recommend'
  import withModules from '@/mixins/withModules'
  import {
    POI_RISK_CONTROL
  } from '@/common/cmm'

  export default {
    name: 'product-list-header',
    mixins: [
      withModules({
        riskControl: POI_RISK_CONTROL
      })
    ],
    props: {
      isNewPoiRecommend: Boolean
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
