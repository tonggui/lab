<template>
  <div class="product-table-info-layout">
    <div class="product-table-info-layout-img">
      <slot name="image"></slot>
    </div>
    <div class="product-table-info-layout-desc">
      <slot name="info">
        <slot name="name"></slot>
        <slot name="description"></slot>
      </slot>
      <div class="product-table-info-layout-scope" v-if="scopeFlag">
        <slot name="scope"></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'product-table-info-layout',
    props: {
      scopeFlag: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-table-info-layout {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    text-align: left;
    &-img {
      flex-shrink: 0;
      margin-right: 10px;
    }
    &-desc {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px 0;
      max-width: calc(100% - 74px);
      small {
        font-size: @font-size-small;
        color: @text-helper-color;
      }
    }
  }
</style>
