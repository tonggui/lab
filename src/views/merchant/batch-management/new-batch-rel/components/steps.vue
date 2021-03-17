<template>
  <div class="steps-bar-container">
    <Steps :current="current" class="steps">
      <Step v-for="step in list" :title="step.title" :key="step.id" />
    </Steps>
  </div>
</template>

<script>
  export default {
    name: 'steps',
    props: {
      list: {
        type: Array,
        default: () => [],
        require: true
      },
      current: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .steps-bar-container {
    width: 100%;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    .steps {
      width: 780px;
      /deep/ .boo-steps-item.boo-steps-status-process .boo-steps-head-inner {
        border-color: #FF6A00;
        background-color: #FF6A00;
      }
      /deep/ .boo-steps-item.boo-steps-status-finish .boo-steps-head-inner {
        border-color: #FF6A00;
        > span {
          color: #FF6A00;
        }
      }
    }
  }
</style>
