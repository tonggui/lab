<template>
  <div class="audit-process-container">
    <AuditProcess
      class="sticky"
      :steps="auditTaskList"
      :current="auditCurrentTask"
      :status="status"
      :formatter="auditTaskFormat"
    />
  </div>
</template>

<script>
  import AuditProcess from '@components/audit-process/index'
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
    name: 'audit-process',
    props: {
      auditTaskList: Array,
      auditStatus: Number
    },
    components: {
      AuditProcess
    },
    computed: {
      auditCurrentTask () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          return this.auditTaskList.length
        }
        const taskList = this.auditTaskList
        // 新增兼容逻辑。
        // 后端只有固定节点，而非日志形式。需要解决！！！
        // TODO taskList.auditState?
        let idx = findIndex(taskList, (task) => [1, 7].includes(task.auditState))
        if (idx > -1) { // 没有待审核/审核中逻辑，就找非0逻辑
          idx = findLastIndex(taskList, task => task.auditState !== 0)
        }
        return idx > -1 ? idx : 0
      },
      status () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) return 'finish'
        const taskList = this.auditTaskList
        const lastTask = taskList[this.auditCurrentTask]
        if (!lastTask) return 'error'
        return errorAuditStatus[lastTask.auditState] ? 'error' : 'process'
      }
    },
    methods: {
      auditTaskFormat (task, key, i) {
        if (key === 'title') {
          return auditStatusText[task.auditState] ? `${task.nodeName} - ${auditStatusText[task.auditState]}` : task.nodeName
        }
        return errorAuditStatus[task.auditState] ? (`驳回原因：${task.comment || ''}`) : ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .audit-process-container {
    flex: 1;
    margin: 0 0 66px 10px;
    background: #fff;
    .sticky {
      position: sticky;
      top: 0;
    }
  }
</style>
