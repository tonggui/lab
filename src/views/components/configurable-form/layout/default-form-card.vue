<template>
  <div class="default-card">
    <slot name="default"></slot>
  </div>
</template>
<script>
  /**
   * 空的form-card 组件，主要用于 嵌套
   */
  export default {
    name: 'default-form-card-layout'
  }
</script>
<style lang="less">
  .default-card {
    + .card {
      margin-top: 10px;
    }
    + .default-card {
      margin-top: 10px;
    }
  }
</style>
