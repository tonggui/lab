<template>
  <Alert
    class="alert"
    :type="audit.type"
    show-icon>
    {{audit.title}}
    <div slot="desc" class="description">
      <div>
        {{audit.desc}}
        <Poptip v-if="audit.hasReason" trigger="click" placement="bottom" :content="reason">
          <span class="reason">查看驳回原因</span>
        </Poptip>
      </div>
      <Button v-if="audit.hasSubmit" type="primary" @click="handleSubmitClickEvent">提交审核</Button>
    </div>
  </Alert>
</template>

<script>
const AUDIT_STATUS = {
  NOT_ON_PROCESS: 0,
  NOT_AUDITED: 1,
  AUDITING: 2,
  REJECTED: 3,
  PASSED: 4
}

const AUDIT_INFO_MAP = {
  [AUDIT_STATUS.NOT_AUDITED]: {
    type: 'info',
    title: '商品未审核',
    desc: '请尽快录入商品提交审核通过后即可上线营业，最少5个商品可提交审核',
    hasSubmit: true
  },
  [AUDIT_STATUS.AUDITING]: {
    type: 'warning',
    title: '商品审核中',
    desc: '商品正在审核中，预计1-2个工作日审核完成，请耐心等待，审核期间商品不可编辑'
  },
  [AUDIT_STATUS.REJECTED]: {
    type: 'error',
    title: '商品被驳回',
    desc: '商品正在审核中，预计1-2个工作日审核完成，请耐心等待，审核期间商品不可编辑',
    hasReason: true,
    hasSubmit: true
  }
}

export default {
  name: 'audit-alert',
  props: {
    status: Number,
    reason: String,
    submit: Object
  },
  computed: {
    audit () {
      return AUDIT_INFO_MAP[this.status] || {}
    }
  },
  methods: {
    async handleSubmitClickEvent () {
      this.$emit('submit')
      console.log(this.submit)
      if (this.submit) {
        try {
          await this.submit()
          this.$Message.success({
            content: '提交成功',
            duration: 2,
            onClose: () => window.location.reload()
          })
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .alert {
    & /deep/ .boo-alert-message {
      font-size: @font-size-base;
      margin-bottom: 4px;
    }
  }

  .reason {
    color: @error-color;
    margin-left: 20px;
    cursor: pointer;
  }

  .description {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
