<template>
  <div class="merchant-cube-breadcrumb">
    <div @click="handleGoBack">
      <Icon style="margin-top: -3px" size="20" type="keyboard-arrow-left" />魔方快捷创建
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
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  .merchant-cube-breadcrumb {
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }
</style>
