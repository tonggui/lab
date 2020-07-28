<template>
  <AuditProcess
    class="audit-task-list"
    :class="{ sticky }"
    :steps="taskList"
    :current="auditCurrentTask"
    :status="status"
    :formatter="auditTaskFormat"
  />
</template>
<script>
  import {
    findLastIndex,
    findIndex
  } from 'lodash'
  import {
    PRODUCT_AUDIT_STATUS
  } from '@/data/enums/product'

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
    name: 'audit-task-list',
    props: {
      sticky: Boolean,
      taskList: {
        type: Array,
        required: true
      },
      status: {
        type: Number,
        required: true
      }
    },
    computed: {
      auditCurrentTask () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          return this.auditTaskList.length
        }
        const taskList = this.product.taskList || []
        // 新增兼容逻辑。
        // 后端只有固定节点，而非日志形式。需要解决！！！
        let idx = findIndex(taskList, [1, 7].includes(taskList.auditState))
        if (idx > -1) { // 没有待审核/审核中逻辑，就找非0逻辑
          idx = findLastIndex(taskList, task => task.auditState !== 0)
        }
        return idx > -1 ? idx : 0
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
  .audit-task-list {
    .sticky {
      position: sticky;
      top: 0;
    }
  }
</style>
