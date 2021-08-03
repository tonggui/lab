<template>
  <div class="merchant-cube-breadcrumb">
    <div class="left">
      <span class="center" @click="handleGoBack">总部商品库</span>
      <div>
        <Icon style="margin-top: -3px; color: #999" size="20" type="keyboard-arrow-right" />魔方快捷创建
      </div>
    </div>
    <MerchantCubeGuide />
  </div>
</template>

<script>
  import MerchantCubeGuide from '../merchant-cube-guide'

  export default {
    name: 'cube-breadcrumb',
    components: {
      MerchantCubeGuide
    },
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
    justify-content: space-between;
    .left {
      display: flex;
      .center {
        cursor: pointer;
        color: #999;
      }
    }
  }
</style>
