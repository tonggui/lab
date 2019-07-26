<template functional>
  <div>
    <div>
      <div class="smart-sort-layout-title">置顶{{ props.name }}</div>
      <slot name="smart-sort-top"></slot>
    </div>
    <div>
      <div class="smart-sort-layout-title">
        智能排序
        <small>点击“+”可添加置顶{{ props.name }}</small>
      </div>
      <slot name="smart-sort-default"></slot>
    </div>
  </div>
</template>
<style lang="less">
.smart-sort-layout {
  &-title {
    font-weight: bold;
    padding-left: 20px;
    line-height: 40px;
    color: @text-color-secondary;
    small {
      color: @text-helper-color;
      font-size: 12px;
      font-weight: normal;
    }
  }
}
</style>
