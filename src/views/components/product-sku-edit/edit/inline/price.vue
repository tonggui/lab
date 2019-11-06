<template>
  <div class="merchant-product-sku-edit-price" :class="{ error }">
    <div>
      <InputNumber :value="value" :max="30000" :min="0" :precision="2" @on-change="handleChange" size="small" clearable>
        <template slot="prefix">¥</template>
      </InputNumber>
    </div>
    <div class="error" v-show="error">{{ error }}</div>
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
      handleChange (e) {
        const value = e.target.value
        this.$emit('change', value)
        this.$emit('input', value)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';

  .merchant-product-sku-edit-price {
    text-align: left;
    position: relative;
    /deep/ .boo-input-wrapper-small .boo-input-prefix {
      font-size: @font-size-small;
      line-height: 28px;
      color: @text-tip-color;
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
