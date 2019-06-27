<template>
  <div class="list">
    <div class="header">
      <PoiNotice />
      <AlertTip v-if="riskControl" type="error">该门店有原价虚高被平台下架商品，请及时处理</AlertTip>
      <AuditAlert />
      <p>TODO: NavigatorBar功能不完善  缺少下载商品 包装袋配置</p>
      <NavigatorBar />
      <HotRecommend />
    </div>
    <div class="content">
      <ListContent></ListContent>
    </div>
    <div class="footer">
      footer
    </div>
  </div>
</template>

<script>
import PoiNotice from './components/poi-notice'
import AuditAlert from './components/audit-alert/index'
import AlertTip from '@components/alert-tip'
import NavigatorBar from './components/navigator-bar'
import HotRecommend from './components/hot-recommend'
import ListContent from './components/list-content'
import withModules from '@/mixins/withModules'
import {
  POI_RISK_CONTROL
} from '@/common/cmm'

export default {
  name: 'product-list',
  mixins: [
    withModules({ riskControl: POI_RISK_CONTROL })
  ],
  components: {
    PoiNotice,
    AuditAlert,
    AlertTip,
    NavigatorBar,
    HotRecommend,
    ListContent
  }
}
</script>
<style scoped lang="less">
  .list {
    color: @primary-color;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .content {
    min-height: 600px;
    background: @content-bg;
  }
</style>
