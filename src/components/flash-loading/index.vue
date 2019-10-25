<template>
  <div class="loading" ref="loading">
    <div class="loading-main" :style="position">
      <FlashLoading />
    </div>
  </div>
</template>
<script>
  import FlashLoading from './flash-loading'

  export default {
    name: 'loading',
    components: {
      FlashLoading
    },
    props: {
      size: { // TODO flash-loading图标的大小
        type: [Number, String],
        default: 36
      }
    },
    data () {
      return {
        position: {
          top: '50%'
        }
      }
    },
    methods: {
      fixedTop () {
        const $loading = this.$refs.loading
        if ($loading) {
          const { top, bottom } = $loading.getBoundingClientRect()
          let offsetTop = (Math.min(window.innerHeight, bottom) - Math.max(top, 0)) / 2
          if (top < 0) {
            offsetTop -= top
          }
          this.position.top = `${offsetTop}px`
        }
      }
    },
    mounted () {
      this.fixedTop()
    }
  }
</script>
<style lang="less" scoped>
  // TODO 滚动条位置
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .9);
    &-main {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
    }
  }
</style>
