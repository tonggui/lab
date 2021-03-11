<template>
  <div class="steps-container">
    <Steps :current="current">
      <Step v-for="step in list" :title="step.title" :key="step.id" />
<!--      <Step title="选择门店" />-->
<!--      <Step title="关联中" />-->
<!--      <Step title="关联完成" />-->
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
  .steps-container {
    width: 100%;
    margin-bottom: 40px;
  }
</style>
