<template>
  <div class="list">
    product list
    <AuditAlert :status="3" reason="test" :submit="submitAudit"/>
  </div>
</template>

<script>
import AuditAlert from './components/audit-alert'

export default {
  name: 'product-list',
  components: {
    AuditAlert
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
