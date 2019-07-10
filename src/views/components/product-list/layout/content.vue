<template functional>
  <div class="content">
    <div class="tag-list">
      <slot name="tag-list"></slot>
    </div>
    <div class="product-list">
      <slot name="product-list"></slot>
    </div>
  </div>
</template>
<style scoped lang="less">
  .content {
    display: flex;
    min-height: 600px;
    width: 100%;
  }
  .tag-list {
    width: 220px;
    border-right: 1px solid @border-color-base;
  }
  .product-list {
    flex: 1;
    min-width: 600px;
  }
</style>
