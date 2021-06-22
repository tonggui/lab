<template>
  <div class="merchant-cube-breadcrumb">
    <span class="center" @click="handleGoBack">总部商品库</span>
    <div>
      <Icon style="margin-top: -3px; color: #999" size="20" type="keyboard-arrow-right" />魔方快捷创建
    </div>
  </div>
</template>

<script>
  export default {
    name: 'cube-breadcrumb',
    methods: {
      handleGoBack () {
        this.$router.push({ name: 'merchantList' })
      }
    }
  }
</script>

<style lang="less" scoped>
  .merchant-cube-breadcrumb {
    display: flex;
    margin-bottom: 10px;
    .center {
      cursor: pointer;
      color: #999;
    }
  }
</style>
