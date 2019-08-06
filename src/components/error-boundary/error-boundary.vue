<template>
  <div>
    <div v-if="error" class="error-boundary">
      <div class="error-container">
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
  .error-boundary {
    height: 100%;
    display: flex;
    align-self: center;
    justify-content: center;
    align-items: center;
    p {
      font-size: 16px;
      color: var(--text-samll-color);
      letter-spacing: 0;
      text-align: center;
      line-height: 19px;
      margin: 20px 0;
    }
  }
  .error-container {
    text-align: center;
  }
</style>
