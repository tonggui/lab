<template>
  <div class="merchant-cube-breadcrumb">
    <div @click="handleGoBack">
      <Icon style="margin-top: -3px" size="20" type="keyboard-arrow-left" />魔方快捷创建
    </div>
  </div>
</template>

<script>
  export default {
    name: 'cube-breadcrumb',
    methods: {
      handleGoBack () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  .merchant-cube-breadcrumb {
    margin-bottom: 10px;
  }
</style>
