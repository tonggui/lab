<template>
  <div class="auto-clear-stock-header">
    <div class="content">
      <span class="title">商品限购配置</span>
      <div class="description danger">
        针对特殊商品，需要限制每个买家在周期内可购买的商品数量时，可以开启限购
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'auto-clear-stock-header'
  }
</script>
<style lang="less" scoped>
  .auto-clear-stock-header {
    background: @component-bg;
    box-shadow: 0 2px 10px 0 #F3F3F4;
    padding: 16px 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .content {
      flex: 1;
    }
    .title {
      font-weight: 600;
      font-size: 20px;
      line-height: 32px;
      color: @text-color;
    }
    .description {
      font-size: @font-size-small;
      color: @text-description-color;
      .guide-link {
        text-decoration: underline;
      }
    }
  }
</style>
