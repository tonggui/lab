<template functional>
  <span>
    <small class="unit">{{ props.unit }}</small>
    <span class="number"><slot>{{ props.number }}</slot></span>
  </span>
</template>
<style lang="less" scoped>
  .unit {
    color: @text-helper-color;
    margin-right: 4px;
  }
  .number {
    color: @text-color;
  }
</style>
