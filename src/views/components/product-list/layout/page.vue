<template>
  <div class="layout-container">
    <slot name="header"></slot>
    <div class="layout-content">
      <slot name="content">
        <ContentLayout>
          <template slot="tag-list">
            <slot name="tag-list"></slot>
          </template>
          <template slot="product-list">
            <slot name="product-list"></slot>
          </template>
        </ContentLayout>
      </slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<script>
  import ContentLayout from './content'

  export default {
    components: {
      ContentLayout
    }
  }
</script>
<style lang="less" scoped>
  .layout {
    &-container {
      color: @primary-color;
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
    &-content {
      display: flex;
      flex: 1;
      background: @content-bg;
      position: relative;
      // &-body {
      //   position: absolute;
      //   width: 100%;
      //   top: 0;
      //   bottom: 0;
      // }
    }
  }
</style>
