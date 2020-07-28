<template>
  <div class="product-audit-check">
    <Loading v-if="loading" />
    <div v-else class="form-container">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <Form
        v-model="product"
        :disabled="auditing"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
        <template slot="footer">
          <Button v-if="auditing">撤销</Button>
          <Button v-else-if="needAudit">{{ auditBtnText }}</Button>
          <Button v-else>保存</Button>
          <Button>取消</Button>
        </template>
      </Form>
    </div>
    <div class="audit-process-container">
      <AuditTaskList :task-list="taskList" :status="auditStatus" sticky />
    </div>
  </div>
</template>
<script>
  import {
    PRODUCT_AUDIT_STATUS
  } from '@/data/enums/product'
  import { WARNING_TIP } from './constants'
  import {
    fetchGetAuditProductDetail
  } from '@/data/repos/product'

  export default {
    name: 'product-audit-check',
    data () {
      return {
        auditStatus: undefined, // 审核状态
        taskList: [], // 审核记录
        productSource: undefined, // 纠错送审还是xxx
        snapshot: {}, // 快照
        approveSnapshot: {}, // xxx快照?
        product: {} // 商品信息
      }
    },
    computed: {
      warningTip () {
        return WARNING_TIP[this.product.auditStatus] || ''
      },
      spuId () {
        return this.$route.query.spuId
      },
      auditing () {
        return this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
      },
      auditBtnText () {
        return this.isCorrectionAudit ? '重新提交审核' : '提交审核'
      }
    },
    methods: {
      async getAuditDetail () {
        try {
          const {
            auditStatus,
            productSource,
            currentMis,
            processId,
            taskList,
            snapshot,
            approveSnapshot,
            ...product
          } = await fetchGetAuditProductDetail(this.spuId)
          this.auditStatus = auditStatus
          this.productSource = productSource
          this.taskList = [...(taskList || []), { nodeName: '商品审核完成' }]
          this.snapshot = snapshot
          this.approveSnapshot = approveSnapshot
          this.product = product
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      }
    },
    mounted () {
      if (this.spuId) {
        this.getAuditDetail()
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-audit-check {
    display: flex;
    width: 100%;
    .form-container {
      width: 75%;
    }
    .audit-process-container {
      flex: 1;
      margin: 0 0 66px 10px;
      background: #fff;
      .sticky {
        position: sticky;
        top: 0;
      }
    }
  }
</style>
