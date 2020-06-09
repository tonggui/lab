<!-- 商品列表布局组件 头 + content + 尾巴 -->
<template>
  <div class="product-list-fixed-page-layout" v-bind="$attrs">
    <slot name="header"></slot>
    <div class="product-list-fixed-page-layout-content">
      <slot name="content">
      </slot>
    </div>
    <slot name="footer"></slot>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'product-list-fixed-page'
  }
</script>
<style lang="less">
  .product-list-fixed-page-layout {
    color: @primary-color;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    overflow: hidden;
    &-content {
      display: flex;
      flex: 1;
      height: 100%;
      background: @content-bg;
      position: relative;
    }
    &-product-list {
      flex: 1;
      min-width: 600px;
    }
  }
</style>
