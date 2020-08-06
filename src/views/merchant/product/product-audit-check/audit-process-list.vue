<template>
  <div class="audit-process-container">
    <AuditProcess
      class="sticky"
      :steps="auditTaskList"
      :current="auditCurrentTask"
      :status="auditStatus"
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
      product: Object
    },
    data () {
      return {
      }
    },
    components: {
      AuditProcess
    },
    computed: {
      auditTaskList () {
        const taskList = this.product.taskList || []
        console.log('taskList', taskList)
        return [...taskList, { nodeName: '商品审核完成' }]
      },
      auditCurrentTask () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          return this.auditTaskList.length
        }
        const taskList = this.product.taskList || []
        // 新增兼容逻辑。
        // 后端只有固定节点，而非日志形式。需要解决！！！
        let idx = findIndex(taskList, task => [1, 7].includes(task.auditState))

        if (idx < 0) { // 没有待审核/审核中逻辑，就找非0逻辑
          idx = findLastIndex(taskList, task => task.auditState !== 0)
        }

        return idx > -1 ? idx : 0
      },
      auditStatus () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) return 'finish'
        const taskList = this.product.taskList || []
        const lastTask = taskList[this.auditCurrentTask]
        if (!lastTask) return 'error'
        return errorAuditStatus[lastTask.auditState] ? 'error' : 'process'
      }
    },
    methods: {
      showList (show, list = []) {
        return show && list.length > 0
      },
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
