<template>
  <div class="list">
    <AuditAlert :status="3" reason="test" :submit="submitAudit"/>
    <NavigatorBar />
  </div>
</template>

<script>
import AuditAlert from './components/audit-alert'
import NavigatorBar from './components/navigator-bar/navigator-bar'

export default {
  name: 'product-list',
  components: {
    AuditAlert,
    NavigatorBar
  },
  methods: {
    async submitAudit () {
      return true
    }
  }
}
</script>

<style scoped lang="less">
  .list {
    color: @primary-color;
  }
</style>
