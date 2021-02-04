<template>
  <div>
    <div class="m-title">商品管理</div>
    <NavigatorBar />
  </div>
</template>
<script>
  import NavigatorBar from './components/navigator-bar'

  export default {
    name: 'merchant-product-list-header',
    components: {
      NavigatorBar
    }
  }
</script>
<style lang="less" scoped>
  .m-title {
    display: flex;
    justify-content: space-between;
    color: @text-color-secondary;
    margin: 10px 0;
  }
</style>
