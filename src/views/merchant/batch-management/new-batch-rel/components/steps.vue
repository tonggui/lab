<template>
  <div class="steps-bar-container">
    <Steps :current="current" class="steps">
      <Step v-for="(step, index) in list" :title="step.title" :key="step.id" :class="computedClass(index)" />
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
    },
    methods: {
      computedClass (index) {
        return {
          'default-step': true,
          [`step-${index}`]: true
        }
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
      display: flex;
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
      /deep/ .boo-steps-item .boo-steps-tail > i {
        background: none;
        border-top: 1px dashed #999999;
      }
      /deep/ .boo-steps-item.boo-steps-status-finish .boo-steps-title {
        color: #FF6A00;
      }
      .default-step {
        display: flex;
        align-items: center;
        &.step {
          &-0 { width: 32% !important; }
          &-1 { width: 22% !important; }
          &-2 { width: 20% !important; }
          &-3 { width: 15% !important; }
        }
      }
    }
  }
</style>
