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
      /deep/ .boo-steps-item .boo-steps-title {
        font-weight: 400;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #222222;
      }
      /deep/ .boo-steps-item .boo-steps-head-inner {
        width: 30px;
        height: 30px;
        line-height: 28px;
        > .boo-steps-icon.boo-icon {
          font-size: 26px;
        }
      }
      /deep/ .boo-steps-item.boo-steps-status-process .boo-steps-head-inner {
        border-color: #FF6A00;
        background-color: #FF6A00;
        > span {
          font-size: 16px;
        }
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
      /deep/ .boo-steps-item.boo-steps-status-process .boo-steps-title {
        color: #FF6A00;
        font-weight: 600;
      }
      /deep/ .boo-steps-item.boo-steps-status-wait .boo-steps-head-inner span {
        color: #666666;
        font-size: 16px;
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
