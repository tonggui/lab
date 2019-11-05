<template>
  <div class="merchant-product-sku-edit-stock" :class="{ error }">
    <div>
      <Input size="small" :value="value" number @on-change="handleChange" clearable />
      <span class="set-zero" @click="handleSetZero">归零</span>
    </div>
    <div class="error">{{ error }}</div>
  </div>
</template>
<script>
  export default {
    name: 'merchant-product-sku-edit-stock',
    props: {
      value: [Number, String],
      validator: Function
    },
    data () {
      return {
        error: ''
      }
    },
    watch: {
      value (value) {
        this.error = this.validator(value)
      }
    },
    methods: {
      triggerChange (value) {
        this.$emit('change', value)
        this.$emit('input', value)
      },
      handleChange (e) {
        const value = e.target.value
        this.triggerChange(value)
      },
      handleSetZero () {
        this.triggerChange(0)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';

  .merchant-product-sku-edit-stock {
    text-align: left;
    position: relative;
    /deep/ .boo-input-wrapper {
      width: 100px;
      margin-right: 4px;
    }
    .set-zero {
      text-decoration: underline;
      font-size: @font-size-small;
      .link()
    }
    &.error {
      /deep/ .boo-input {
        border: 1px solid @error-color;
      }
    }
    .error {
      position: absolute;
      color: @error-color;
      font-size: @font-size-small;
      line-height: 1;
      margin-top: 4px;
    }
  }
</style>
