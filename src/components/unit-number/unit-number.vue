<template>
  <span class="unit-number">
    <small class="unit" v-if="!!unit">{{ unit }}</small>
    <slot>
      <EmptyDefaultShow class="number" :value="number" :empty-show="emptyShow" />
    </slot>
    <!-- <span class="number"><slot>{{ props.number }}</slot></span> -->
  </span>
</template>
<script>
  export default {
    name: 'unit-number',
    props: {
      unit: String,
      number: [Number, String],
      emptyShow: String
    }
  }
</script>
<style lang="less" scoped>
  .unit-number {
    display: inline-flex;
    align-items: center;
    &.danger .number {
      color: @error-color;
    }
  }
  .unit {
    color: @text-helper-color;
    margin-right: 4px;
  }
  .number {
    color: @text-color;
  }
</style>
