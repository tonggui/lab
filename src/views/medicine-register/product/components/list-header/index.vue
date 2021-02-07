<template>
  <div class="header">
    <div class="m-title">疫情药品设置</div>
    <NavigatorBar />
  </div>
</template>
<script>
  import NavigatorBar from './components/navigator-bar'
  export default {
    name: 'medicine-register-list-header',
    components: {
      NavigatorBar
    }
  }
</script>
<style lang="less" scoped>
  .header {
    margin-bottom: 10px;
  }
  .m-title {
    display: flex;
    justify-content: space-between;
    color: @text-color-secondary;
    margin: 10px 0;
  }
</style>
