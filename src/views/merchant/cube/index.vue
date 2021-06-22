<template>
  <div>
    <router-view name="breadCrumb"></router-view>
    <CubeSteps />
    <router-view></router-view>
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

<style scoped>

</style>
