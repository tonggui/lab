<template>
  <div class="merchant-cube-container" :style="style">
    <router-view name="breadCrumb"></router-view>
    <CubeSteps />
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
          const route = this.$router.match(window.location.pathname)
          console.log('路由变化', route)
          if (route && route.name !== 'merchantCubeList') this.style = { height: '100vh' }
          else this.style = {}
        }
      }
    },
    mounted () {
      window.addEventListener('hashchange', () => {
        console.log('hash监听', window.location.hash)
      })
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
