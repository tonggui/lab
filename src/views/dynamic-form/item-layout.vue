<template>
  <div class="form-item-container">
    <div class="label" v-if="config.label">
      <span class="red" v-if="config.required">*</span>
      {{ config.label || '' }}
    </div>
    <div v-else>no label</div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-layout',
  props: {
    config: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .form-item-container {
    display: flex;
    align-items: center;
    margin: 20px 0;
    .label {
      width: 80px;
      text-align: right;
      margin-right: 20px;
      color: @brand-color;
    }
    .content {
      flex: 1;
      text-align: left;
    }
  }
</style>
