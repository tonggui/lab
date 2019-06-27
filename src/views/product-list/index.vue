<template>
  <div class="list">
    <AuditAlert :status="3" reason="test" :submit="submitAudit"/>
    <NavigatorBar />
    <div @click="goTo">测试路由调跳转</div>
    <div v-if="PRODUCT_MULTITAG">PRODUCT_MULTITAG</div>
  </div>
</template>

<script>
import AuditAlert from './components/audit-alert'
import NavigatorBar from './components/navigator-bar/navigator-bar'
import withModules from '@/mixins/withModules'
import { PRODUCT_MULTITAG } from '@/common/cmm'

export default {
  name: 'product-list',
  components: {
    AuditAlert,
    NavigatorBar
  },
  mixins: [
    withModules({
      PRODUCT_MULTITAG
    })
  ],
  methods: {
    async submitAudit () {
      return true
    },
    goTo () {
      this.$router.replace({
        path: '/product/list',
        query: {
          wmPoiId: Date.now()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .list {
    color: @primary-color;
    display: flex;
    flex-direction: column;
  }
  .list-body {
    display: flex;
    flex: auto;
    min-height: 600px;
  }
  .tag-list {
    width: 240px;
  }
</style>
