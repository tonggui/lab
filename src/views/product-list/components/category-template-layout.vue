<template functional>
  <div class="category-template-layout">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'category-template-layout'
  }
</script>
<style lang="less" scoped>
  .category-template-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      padding: 20px 30px;
      font-size: 20px;
      font-weight: bold;
      line-height: 28px;
      color: #333333;
      border-bottom: 1px solid @border-color-base;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .footer {
      border-top: 1px solid @border-color-base;
      padding: 10px 0;
      text-align: center;
      /deep/ button {
        margin-right: 10px;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
</style>
