<template>
  <div class="sp-apply-page">
    <div class="form-container">
      <Alert v-if="auditApproved" type="success" show-icon>此商品已录入商品库，可前往商品库新建此商品。</Alert>
      <Alert v-if="context.auditing" type="warning" show-icon>此商品正在审核中，请等待审核完成或撤销审核后再进行修改</Alert>
      <MedicineApplyForm
        :data="data"
        :context="context"
        @confirm="handleConfirm"
        @revoke="handleRevokeAudit"
        @cancel="handleCancel"
        @create="handleCrateProductBySp"
      />
    </div>
    <AuditProcess
      v-if="approved"
      class="sp-audit-process"
      :steps="tasks"
      :current="auditCurrentTask"
      :auditStatus="auditProcessState"
      :formatter="auditTaskFormat"
    />
  </div>
</template>

<script>
  import noop from 'lodash/noop'
  import AuditProcess from '@/components/audit-process'
  import MedicineApplyForm from '@/views/components/medicine-apply-form/form'
  import {
    fetchSpAuditDetailInfo,
    saveOrUpdate,
    commitAudit,
    cancelAudit
  } from '@/data/repos/medicineSpAudit'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import findIndex from 'lodash/findIndex'
  import findLastIndex from 'lodash/findLastIndex'

  const errorAuditStatus = {
    3: '审核驳回',
    4: '审核驳回'
  }

  const auditStatusText = {
    1: '审核中',
    2: '审核通过',
    6: '审核撤销',
    7: '审核中', // 审核驳回待审核
    ...errorAuditStatus
  }

  export default {
    name: 'SpApply',
    components: {
      AuditProcess,
      MedicineApplyForm
    },
    data () {
      return {
        poiId: 0,
        spId: 0,
        tasks: [],
        data: {},
        context: {
          auditing: false,
          auditStatus: 0,
          auditApproved: false
        }
      }
    },
    computed: {
      approved () {
        return this.context.auditStatus > 0
      },
      auditApproved () {
        return this.context.auditStatus === 2
      },
      auditCurrentTask () {
        if (this.context.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          return this.tasks.length
        }
        const taskList = this.tasks || []
        // 新增兼容逻辑。
        // 后端只有固定节点，而非日志形式。需要解决！！！
        let idx = findIndex(taskList, task => [1, 7].includes(task.auditState))
        if (idx > -1) { // 没有待审核/审核中逻辑，就找非0逻辑
          idx = findLastIndex(taskList, task => task.auditState !== 0)
        }
        return idx > -1 ? idx : 0
      },
      auditProcessState () {
        if (this.context.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) return 'finish'
        const taskList = this.tasks || []
        const lastTask = taskList[this.auditCurrentTask]
        if (!lastTask) return 'error'
        return errorAuditStatus[lastTask.auditState] ? 'error' : 'process'
      }
    },
    watch: {
      auditApproved: {
        immediate: true,
        handler (v) {
          this.context.auditApproved = v
        }
      }
    },
    methods: {
      // 审核记录展示
      auditTaskFormat (task, key, i) {
        if (key === 'title') {
          return auditStatusText[task.auditState] ? `${task.nodeName} - ${auditStatusText[task.auditState]}` : task.nodeName
        }
        // 如果当前序号大于目前进行中的任务节点，则异常后续信息（解决后端驳回场景下未增加节点的问题）
        if (i > this.auditCurrentTask) { return '' }
        return errorAuditStatus[task.auditState] ? (`驳回原因：${task.comment || ''}`) : ''
      },
      async handleRevokeAudit (cb = noop) {
        try {
          await cancelAudit(this.spId)
          this.$Message.success('审核撤销成功')
          this.goBack()
          cb()
        } catch (e) {
          this.$Message.error(e.message)
          cb(e)
        }
      },
      async handleConfirm (audit = true, data, cb = noop) {
        try {
          if (audit) {
            await commitAudit(this.poiId, this.spId, data)
            this.$Message.success('成功提交审核')
            this.$Modal.confirm({
              title: '成功提交审核',
              content: '商品审核通过后可从商品库新建该商品。您可以在「商品审核」中查看审核进度。',
              centerLayout: true,
              iconType: null,
              okText: '返回商品列表',
              cancelText: '查看商品审核',
              onOk: () => {
                this.$router.replace({ name: 'productList', query: { wmPoiId: this.poiId } })
              },
              onCancel: () => {
                this.$router.replace({ name: 'spAuditList', query: { wmPoiId: this.poiId } })
              }
            })
          } else {
            await saveOrUpdate(this.poiId, this.spId, data)
            this.$Message.success('草稿保存成功')
            this.goBack()
          }
          cb()
        } catch (e) {
          cb(e)
          this.$Message.error(e.message)
        }
      },
      handleCancel () {
        this.goBack()
      },
      handleCrateProductBySp (spInfo) {
        this.$router.push({
          name: 'spCreate',
          query: {
            wmPoiId: this.poiId,
            name: spInfo.name || '',
            upc: (spInfo.upcList || [])[0] || ''
          }
        })
      },
      goBack () {
        window.history.go(-1)
      }
    },
    async created () {
      const { wmPoiId, spId } = this.$route.query
      this.poiId = +wmPoiId
      this.spId = +spId || 0
      if (this.spId) {
        const { tasks = [], auditStatus, ...spInfo } = await fetchSpAuditDetailInfo(this.poiId, this.spId)
        this.data = spInfo
        this.tasks = tasks
        this.context.auditStatus = +auditStatus || 0
        this.context.auditing = this.context.auditStatus === 1
      }
    }
  }
</script>

<style scoped lang="less">
.sp-apply-page {
  display: flex;
  .form-container {
    flex: 1;
  }
  .sp-audit-process {
    width: 300px;
    background: #fff;
    margin-left: 20px;
  }
}
</style>
