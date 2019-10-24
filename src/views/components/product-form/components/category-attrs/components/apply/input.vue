<template>
  <div class="apply-input">
    <Input class="input" :class="{ error: !!error }" v-bind="$attrs" v-on="$listeners" />
    <div class="error-msg error">{{ error }}</div>
  </div>
</template>

<script>
  export default {
    name: 'apply-input',
    props: {
      value: String,
      error: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .apply-input {
    & > .error-msg {
      color: @error-color;
      font-size: @font-size-base;
    }
    & > .input.error {
      /deep/ input {
        border-color: @error-color;
      }
    }
  }
</style>
