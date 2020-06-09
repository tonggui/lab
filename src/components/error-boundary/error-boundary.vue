<template>
  <div class="container">
    <div v-if="error" class="error-boundary" :class="{ center }">
      <div class="error-boundary-body" :style="styles" v-if="mode">
        <p>{{ description }}</p>
        <Button @click="handleRefresh">请点击刷新</Button>
      </div>
      <div class="error-boundary-body-loading-error" v-else>
        <img :src="imgSrc" width="208" />
        <a @click="handleRefresh">加载失败，请点击<span>重试</span></a>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script>
  import LoadingErrorImg from '@/assets/loading-error.svg'
  export default {
    name: 'error-boundary',
    props: {
      error: {
        type: Boolean,
        required: true
      },
      description: {
        type: String,
        default: '哎呦，哪里出错了～'
      },
      top: Number,
      type: String
    },
    computed: {
      center () {
        return this.top === undefined
      },
      styles () {
        if (!this.center) {
          return { marginTop: `${this.top}px` }
        }
        return {}
      },
      imgSrc () {
        return LoadingErrorImg
      },
      mode () {
        return this.type === undefined
      }
    },
    methods: {
      handleRefresh () {
        this.$emit('refresh')
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
  }
  .error-boundary {
    height: 100%;
    display: flex;
    align-self: center;
    justify-content: center;
    &.center {
      align-items: center;
    }
    p {
      font-size: 16px;
      letter-spacing: 0;
      text-align: center;
      line-height: 19px;
      margin: 20px 0;
    }
    &-body {
      text-align: center;
    }
    &-body-loading-error {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
      > a {
        margin-top: 18px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #999999;
        text-align: center;
        line-height: 24px;
        > span {
          color: #FF8D4E;
          text-decoration: underline;
        }
      }
    }
  }
</style>
