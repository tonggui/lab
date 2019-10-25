<template>
 <div class="loading" :class="`loading-${size}`" ref="loading">
    <div class="loading-main" :style="position">
      <span>
        <!--<Icon type="loading" size="18" />-->
        <FlashLoading :size="size" />
      </span>
      <div class="loading-text" v-if="showText"><slot></slot></div>
    </div>
  </div>
</template>
<script>
  import FlashLoading from './flash-loading'

  export default {
    name: 'loading',
    components: { FlashLoading },
    props: {
      size: {
        type: String,
        validator (size) {
          return ['small', 'default', 'large'].includes(size)
        },
        default: 'default'
      }
    },
    data () {
      return {
        position: {
          top: '50%'
        }
      }
    },
    computed: {
      showText () {
        return this.$slots.default !== undefined
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
          if (offsetTop > 0) {
            this.position.top = `${offsetTop}px`
          }
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
    font-size: @font-size-small;
    &.loading-small {
      font-size: @font-size-small;
    }
    &.loading-large {
      font-size: @font-size-base;
    }
    &-main {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
    }
    &-text {
      min-width: 48px;
      color: @text-description-color;
      text-align: center;
    }
  }
</style>
