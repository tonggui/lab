<!-- 商品列表布局组件 头 + (左tag + 右product) + 尾巴 -->
<template>
  <div class="product-list-page-layout" v-bind="$attrs">
    <slot name="header"></slot>
    <div class="product-list-page-layout-content">
      <slot name="content">
        <div class="product-list-page-layout-tag-list">
          <slot name="tag-list"></slot>
        </div>
        <div class="product-list-page-layout-product-list">
          <slot name="product-list"></slot>
        </div>
      </slot>
    </div>
    <slot name="footer"></slot>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'product-list-page'
  }
</script>
<style lang="less">
  .product-list-page-layout {
    color: @primary-color;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    margin-bottom: 10px;
    &-content {
      display: flex;
      flex: 1;
      height: 100%;
      background: @content-bg;
      position: relative;
      min-height: 600px;
      // &-body {
      //   position: absolute;
      //   width: 100%;
      //   top: 0;
      //   bottom: 0;
      // }
    }
    &-tag-list {
      width: 220px;
      border-right: 1px solid @border-color-base;
      position: relative;
      > div {
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
      }
    }
    &-product-list {
      flex: 1;
      min-width: 600px;
    }
  }
</style>
