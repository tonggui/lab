
<template>
  <div class="audit-alert-container">
    <AuditAlert v-if="!!show" :status="status" :auditInfo="auditInfo" @submit="handleSubmit"></AuditAlert>
  </div>
</template>
<script>
  import { isFinite } from 'lodash'
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
      }),
      show () {
        return !!this.auditInfo && [
          AUDIT_STATUS.NOT_ON_PROCESS,
          AUDIT_STATUS.NOT_AUDITED,
          AUDIT_STATUS.AUDITING,
          AUDIT_STATUS.REJECTED
        ].includes(this.status)
      }
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
          // https://km.sankuai.com/page/337853413#id-3.4%E9%97%A8%E5%BA%97%E6%8F%90%E4%BA%A4%E5%AE%A1%E6%A0%B8%EF%BC%88%E5%A4%8D%E7%94%A8%E5%B7%B2%E6%9C%89%E6%8E%A5%E5%8F%A3%EF%BC%89
          if (err.code === 30101 || err.code === 30102) { // 30101: 门店不在上单流程中  30102: 门店商品数太少
            this.$Modal.info({
              width: 390,
              title: '暂不可提交审核',
              content: '店内商品数量未达到5个，不可提交审核，请尽快创建。',
              centerLayout: true,
              iconType: '',
              okText: '我知道了'
            })
            return
          }
          if (err.code === 30102) { // 30102: 门店商品数太少
            this.$Modal.info({
              width: 390,
              title: '暂不可提交审核',
              content: '门店其他信息审核通过后，方可提交商品审核。',
              centerLayout: true,
              iconType: '',
              okText: '我知道了'
            })
            return
          }
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
        const limitProductCount = isFinite(this.totalProductCount) && this.totalProductCount > 5
        if (!limitProductCount) {
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
