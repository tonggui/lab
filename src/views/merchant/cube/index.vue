<template>
  <div class="merchant-cube-container" :style="style">
    <div class="sticky-top">
      <router-view name="breadCrumb"></router-view>
      <CubeSteps />
    </div>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
  import CubeSteps from './components/cube-steps'

  export default {
    name: 'cube',
    data () {
      return {
        style: {}
      }
    },
    components: {
      CubeSteps
    },
    watch: {
      '$route': {
        immediate: true,
        handler () {
          const baseUrl = process.env.VUE_APP_BASE_URL || '/reuse/sc/product/views'
          const route = this.$router.match(window.location.pathname)
          if (route && route.path && route.path.replace(baseUrl, '') !== '/merchant/cube/list') this.style = { height: '100vh' }
          else this.style = {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .merchant-cube-container {
    display: flex;
    flex-direction: column;
    .sticky-top {
      background: #F7F8FA;
      position: sticky;
      top: 0;
      z-index: 111
    }
    .content {
      flex: 1;
    }
  }
</style>
