<template>
  <div class="container">
    <div v-if="error" class="error-boundary" :class="{ center }">
      <div class="error-boundary-body" :style="styles">
        <p>{{ description }}</p>
        <Button @click="handleRefresh">请点击刷新</Button>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script>
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
      top: Number
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
  }
</style>
