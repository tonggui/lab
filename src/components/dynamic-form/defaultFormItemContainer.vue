<template>
  <div class="form-item-container">
    <div class="label" v-if="label">
      <span class="red" v-if="required">*</span>
      {{ label || '' }}
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'form-item-container',
    props: {
      label: String,
      required: Boolean
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
  }
  .content {
    flex: 1;
    text-align: left;
  }
}
</style>
