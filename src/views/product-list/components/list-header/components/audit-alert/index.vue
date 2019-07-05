
<template>
  <AuditAlert :status="status" :reason="reason" :submit="handleSubmit"></AuditAlert>
</template>
<script>
import {
  fetchGetPoiAuditInfo,
  fetchSubmitPoiAudit
} from '@/data/repos/poi'
import AuditAlert from './audit-alert'

export default {
  name: 'audit-alert-container',
  data () {
    return {
      status: null, // 状态
      reason: '' // 原因
    }
  },
  components: {
    AuditAlert
  },
  mounted () {
    fetchGetPoiAuditInfo().then(data => {
      this.status = data.status
      this.reason = data.message
    })
  },
  methods: {
    async handleSubmit () {
      try {
        await fetchSubmitPoiAudit()
        this.$Message.success('提交成功', 3, () => this.$router.history.reload())
      } catch (err) {
        this.$Message.error(err.message || err)
      }
    }
  }
}
</script>
