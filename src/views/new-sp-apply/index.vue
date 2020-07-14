<template>
  <div class="combine-product-edit">
    <div class="form-container">
      <Alert v-if="auditApproved" type="success" show-icon>此商品已录入商品库，可前往商品库新建此商品。</Alert>
      <Alert v-if="auditing" type="warning" show-icon>此商品正在审核中，请等待审核完成或撤销审核后再进行修改</Alert>
      <Loading v-if="loading" />
      <Form
        v-else
        v-model="data"
        :disabled="auditing || auditApproved"
        @cancel="handleCancel"
        @confirm="handleConfirm"
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
  import Form from '@/views/components/configurable-form/instance/standard-audit'
  import AuditProcess from '@/components/audit-process'
  import {
    fetchSpAuditDetailInfo
  } from '@/data/repos/medicineSpAudit'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import findIndex from 'lodash/findIndex'
  import findLastIndex from 'lodash/findLastIndex'
  import lx from '@/common/lx/lxReport'

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
    data () {
      return {
        // TODO
        loading: true,
        data: {},
        tasks: [],
        auditStatus: 0
      }
    },
    components: {
      AuditProcess,
      Form
    },
    computed: {
      spId () {
        return this.$route.query.spId
      },
      poiId () {
        return this.$route.query.wmPoiId
      },
      approved () {
        return this.auditStatus > 0
      },
      auditApproved () {
        return this.auditStatus === 2
      },
      auditing () {
        return this.auditStatus === 1
      },
      auditCurrentTask () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
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
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) return 'finish'
        const taskList = this.tasks || []
        const lastTask = taskList[this.auditCurrentTask]
        if (!lastTask) return 'error'
        return errorAuditStatus[lastTask.auditState] ? 'error' : 'process'
      }
    },
    async mounted () {
      try {
        this.loading = true
        if (this.spId) {
          await this.getDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      // 审核记录展示
      auditTaskFormat (task, key, i) {
        const nodeName = task.nodeName || '系统审核'
        if (key === 'title') {
          return auditStatusText[task.auditState] ? `${nodeName} - ${auditStatusText[task.auditState]}` : nodeName
        }
        // 如果当前序号大于目前进行中的任务节点，则异常后续信息（解决后端驳回场景下未增加节点的问题）
        if (i > this.auditCurrentTask) { return '' }
        return errorAuditStatus[task.auditState] ? (`驳回原因：${task.comment || ''}`) : ''
      },
      handleConfirm () {
        console.log('confirm', this.product)
      },
      handleCancel () {
        // 审核过的商品，无法再次编辑，所以可以直接返回。其他场景需要确认后退出
        if (!this.approved) {
          lx.mc({ bid: 'b_shangou_online_e_zymhs1z7_mc' })
          this.$Modal.confirm({
            title: '提示',
            content: '是否退出当前页面',
            okText: '确定',
            cancelText: '取消',
            onOk: () => this.goBack()
          })
        } else {
          this.goBack()
        }
      },
      goBack () {
        window.history.go(-1)
      },
      async getDetail () {
        try {
          const { tasks = [], auditStatus, ...spInfo } = await fetchSpAuditDetailInfo(this.poiId, this.spId)
          this.data = spInfo
          this.tasks = tasks
          this.auditStatus = +auditStatus || 0
          lx.mv({
            bid: 'b_shangou_online_e_kthpf02y_mv',
            val: { poi_id: this.poiId, status: this.auditStatus }
          })
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>
