<template>
  <div class="header">
    <PoiNotice />
    <AlertTip v-if="riskControl" type="error">该门店有原价虚高被平台下架商品，请及时处理</AlertTip>
    <AuditAlert />
    <p>TODO: NavigatorBar功能不完善  缺少下载商品 包装袋配置</p>
    <NavigatorBar />
    <HotRecommend v-if="showHotRecommend" />
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
  POI_RISK_CONTROL,
  POI_HOT_RECOMMEND
} from '@/common/cmm'
// TODO 思考是否合适
import state from '@/views/product-list/store'

export default {
  name: 'product-list-header',
  mixins: [
    withModules({
      riskControl: POI_RISK_CONTROL,
      hotRecommend: POI_HOT_RECOMMEND
    })
  ],
  computed: {
    showHotRecommend () {
      return state.productCount <= 5 && this.hotRecommend
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
