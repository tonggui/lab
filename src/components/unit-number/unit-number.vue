<template functional>
  <span class="unit-number">
    <small class="unit">{{ props.unit }}</small>
    <slot><span class="number">{{ props.number }}</span></slot>
    <!-- <span class="number"><slot>{{ props.number }}</slot></span> -->
  </span>
</template>
<style lang="less" scoped>
  .unit-number {
    display: inline-flex;
    align-items: center;
  }
  .unit {
    color: @text-helper-color;
    margin-right: 4px;
  }
  .number {
    color: @text-color;
  }
</style>
