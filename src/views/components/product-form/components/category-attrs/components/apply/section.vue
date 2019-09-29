<template functional>
  <div class="apply-section">
    <div class="apply-section-title">
      <slot name="title">{{ props.title }}</slot>
    </div>
    <div class="apply-section-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .apply-section {
    .apply-section-title {
      font-size: @font-size-large;
      font-weight: bold;
    }
    .apply-section-content {
      padding: 10px 0;
    }
  }
</style>
