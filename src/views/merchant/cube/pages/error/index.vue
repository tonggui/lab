<template>
  <div class="merchant-cube-error-container">
    <div class="error-msg">网络异常，请重试</div>
    <Button type="primary" @click="handleRetry">重试</Button>
  </div>
</template>

<script>
  export default {
    name: 'error',
    methods: {
      handleRetry () {
        this.$router.push({ name: 'merchantCubeList' })
      }
    }
  }
</script>

<style lang="less" scoped>
  .merchant-cube-error-container {
    background: #fff;
    padding-top: 200px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    .error-msg {
      margin-bottom: 20px;
    }
  }
</style>
