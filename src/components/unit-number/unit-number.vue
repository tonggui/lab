<template>
  <span class="unit-number">
    <small class="unit" v-if="!!unit">{{ unit }}</small>
    <slot><span class="number">{{ number | defaultShow }}</span></slot>
    <!-- <span class="number"><slot>{{ props.number }}</slot></span> -->
  </span>
</template>
<script>
  export default {
    name: 'unit-number',
    props: {
      unit: String,
      number: [Number, String]
    },
    filters: {
      defaultShow (value) {
        if (value === undefined || value === null) {
          return '--'
        }
        return value
      }
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
