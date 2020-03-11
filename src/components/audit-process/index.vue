<template>
  <div class="audit-process">
    <h3 class="audit-process-title">审核记录</h3>
    <Steps
      class="audit-process-steps"
      :current="current"
      direction="vertical"
      :status="status"
    >
      <Step
        v-for="(node, idx) in steps"
        :key="idx"
        :title="convert(node, 'title', idx)"
        :content="convert(node, 'content', idx)"
      />
    </Steps>
  </div>
</template>

<script>
  export default {
    name: 'AuditProcess',
    props: {
      status: {
        type: String,
        default: 'process',
        validate (val) {
          return ['wait', 'process', 'finish', 'error'].indexOf(val) > -1
        }
      },
      steps: {
        type: Array,
        required: true
      },
      current: {
        type: Number,
        required: true,
        validate (v) {
          return v >= 0 && v < this.steps.length
        }
      },
      formatter: Function
    },
    methods: {
      convert (node, type, index) {
        if (this.formatter) {
          return this.formatter(node, type, index)
        }
        return node[type]
      }
    }
  }
</script>

<style scoped lang="less">
.audit-process {
  padding: 16px 24px;
  .audit-process-title {
    padding-bottom: 10px;
    border-bottom: 1px solid @border-color-base;
    margin-bottom: 16px;
  }
  .audit-process-steps {
    & /deep/ .boo-steps-head {
      background: transparent;
    }
    & /deep/ .boo-steps-title {
      background: transparent;
    }
  }
}
</style>
