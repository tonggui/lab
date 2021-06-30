<template>
  <div class="merchant-cube-container">
    <router-view name="breadCrumb"></router-view>
    <CubeSteps />
    <router-view class="content"></router-view>
  </div>
</template>

<script>
  import CubeSteps from './components/cube-steps'

  export default {
    name: 'cube',
    components: {
      CubeSteps
    }
  }
</script>

<style lang="less" scoped>
  .merchant-cube-container {
    //height: 100vh;
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
    }
  }
</style>
