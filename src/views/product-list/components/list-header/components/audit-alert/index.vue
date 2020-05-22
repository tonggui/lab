
<template>
  <div class="audit-alert-container">
    <AuditAlert v-if="!!auditInfo" :status="status" :auditInfo="auditInfo" @submit="handleSubmit"></AuditAlert>
  </div>
</template>
<script>
  import { isNumber } from 'lodash'
  import {
    fetchSubmitPoiAudit
  } from '@/data/repos/poi'
  import { mapModule } from '@/module/module-manage/vue'
  import AuditAlert from './audit-alert'
  import {
    POI_AUDIT_INFO, POI_AUDIT_STATUS
  } from '@/module/moduleTypes'
  import { STATUS as AUDIT_STATUS } from '@/data/enums/poi'
  import LocalStorage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'audit-alert-container',
    props: {
      totalProductCount: Number
    },
    computed: {
      ...mapModule({
        auditInfo: POI_AUDIT_INFO,
        status: POI_AUDIT_STATUS
      })
    },
    components: {
      AuditAlert
    },
    watch: {
      totalProductCount () {
        this.showGuideModal()
      },
      status () {
        this.showGuideModal()
      }
    },
    methods: {
      // 提交审核逻辑修改
      async handleSubmit (callback) {
        try {
          await fetchSubmitPoiAudit()
          this.$Modal.info({
            width: 372,
            title: '审核提交成功',
            content: '每天 10:00～12:00、13:00～16:00 时段提交将于 30分钟内审核完成；其余时段提交将于第二天 17:00 前审核完成。',
            centerLayout: true,
            iconType: '',
            okText: '我知道了',
            onOk: () => window.location.reload()
          })
        } catch (err) {
          this.$Message.error(err.message)
        } finally {
          callback && callback()
        }
      },
      showGuideModal () {
        if (this.guideModal) {
          return
        }
        if (this.status !== AUDIT_STATUS.NOT_AUDITED) {
          return
        }
        if (!isNumber(this.totalProductCount) || this.totalProductCount < 5) {
          return
        }
        if (LocalStorage[KEYS.POI_AUDIT_GUIDE_MODAL]) {
          return
        }
        const setStorage = () => {
          LocalStorage[KEYS.POI_AUDIT_GUIDE_MODAL] = true
        }

        this.guideModal = this.$Modal.confirm({
          width: 287,
          title: '是否提交审核',
          content: '店内商品数量已达到5个，可提交审核。',
          centerLayout: true,
          iconType: '',
          cancelText: '稍后再说',
          okText: '立即提交',
          onCancel: () => setStorage(),
          onOk: async () => {
            setStorage()
            await this.handleSubmit()
          }
        })
      },
      created () {
        this.guideModal = null
      }
    }
  }
</script>
<style lang="less" scoped>
  .audit-alert-container {
    background: @component-bg;
  }
</style>
