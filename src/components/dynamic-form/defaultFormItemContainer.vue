<template>
  <div class="form-item-container">
    <div class="label">
      <span class="red" v-if="config.required">*</span>
      {{ config.label || '' }}
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'form-item-container',
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
}
</style>
