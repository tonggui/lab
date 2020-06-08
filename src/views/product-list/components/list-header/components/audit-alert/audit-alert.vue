<template>
  <Alert class="audit-alert" :type="type" show-icon>
    <Icon slot="icon" class="audit-alert-icon" :class="{ 'with-title': hasTitle  }" size="16" v-bind="icon" />
    <div class="audit-alert-title" v-if="hasTitle">
      {{auditInfo.title}}
    </div>
    <div class="audit-alert-description" :class="{ 'with-title': hasTitle }">
      <div>
        {{auditInfo.description}}
        <span v-if="showReason" class="audit-alert-reason" @click="handleShowReason">查看驳回原因</span>
      </div>
      <Button v-if="showSubmit" :loading="submitting" type="primary" @click="handleSubmitClickEvent">提交审核</Button>
    </div>
  </Alert>
</template>

<script>
  import { STATUS as AUDIT_STATUS } from '@/data/enums/poi'

  export default {
    name: 'audit-alert',
    props: {
      status: Number,
      auditInfo: Object,
      submit: Function
    },
    data () {
      return {
        submitting: false
      }
    },
    computed: {
      showReason () {
        return this.status === AUDIT_STATUS.REJECTED && !!this.auditInfo.rejectReason
      },
      showSubmit () {
        return [
          AUDIT_STATUS.NOT_ON_PROCESS,
          AUDIT_STATUS.NOT_AUDITED,
          AUDIT_STATUS.REJECTED
        ].includes(this.status)
      },
      hasTitle () {
        return !!this.auditInfo.title
      },
      icon () {
        if (this.status === AUDIT_STATUS.AUDITING) {
          return { local: 'clock-filled', color: '#F89800' }
        }
        return { type: 'error' }
      },
      type () {
        return this.status === AUDIT_STATUS.AUDITING ? 'warning' : 'error'
      }
    },
    methods: {
      handleShowReason () {
        this.$Modal.info({
          title: '驳回原因',
          render: () => <div style="word-break: break-all;">{this.auditInfo.rejectReason}</div>,
          iconType: '',
          centerLayout: true,
          okText: '我知道了'
        })
      },
      // 提交审核逻辑修改
      handleSubmitClickEvent () {
        this.submitting = true
        this.$emit('submit', () => {
          this.submitting = false
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/common.less';
  .audit-alert {
    margin-bottom: 0;
    padding: 9px 24px 9px 40px;
    border-radius: 0;
    &-icon {
      margin-top: 8px;
      &.with-title {
        margin-top: 4px;
      }
    }
    &-title {
      font-size: @font-size-large;
      color: #333333;
      font-weight: 600;
    }
    &-description {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 32px;
      &.with-title {
        color: #676A78;
      }
    }
    &-reason {
      text-decoration: underline;
      .link()
    }
  }
</style>
