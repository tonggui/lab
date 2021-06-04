<template>
  <div class="error-page-container">
    <div class="error">加载失败，请点击<a href="" @click.prevent="$emit('on-retry')">重试</a></div>
  </div>
</template>

<script>
  export default {
    name: 'error-page'
  }
</script>

<style lang="less" scoped>
.error-page-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  .error {
    font-size: 14px;
    color: #585A6E;
    line-height: 16px;
    > a {
      text-decoration: underline;
    }
  }
}
</style>
