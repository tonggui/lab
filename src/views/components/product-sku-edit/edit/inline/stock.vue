<template>
  <div class="merchant-product-sku-edit-stock" :class="{ error }">
    <div>
      <Input number size="small" v-model="selfValue" clearable @on-blur="handleBlur" />
      <span class="set-zero" @click="handleSetZero">归零</span>
    </div>
    <div class="error">{{ error }}</div>
  </div>
</template>
<script>
  import {
    PRODUCT_MAX_STOCK,
    PRODUCT_MIN_STOCK,
    PRODUCT_INFINITE_STOCK
  } from '@/data/constants/product'

  export default {
    name: 'merchant-product-sku-edit-stock',
    props: {
      value: [Number, String],
      validator: Function
    },
    data () {
      return {
        error: '',
        selfValue: this.value
      }
    },
    watch: {
      value (value) {
        if (this.selfValue !== value) {
          this.selfValue = value
        }
      },
      selfValue (newValue, oldValue) {
        if (/^-$/.test(newValue)) {
          this.error = ''
          return
        }
        if (newValue) {
          // 校验无限库存
          if (Number(newValue) === PRODUCT_INFINITE_STOCK) {
            return
          }
          // 校验整数库存
          const reg = /^(([1-9]\d*)|0)$/
          if (!reg.test(newValue.toString())) {
            this.$nextTick(() => {
              this.selfValue = oldValue
            })
            return
          }
          if (newValue < PRODUCT_MIN_STOCK) {
            this.$nextTick(() => {
              this.selfValue = PRODUCT_MIN_STOCK
            })
            return
          }
          if (newValue > PRODUCT_MAX_STOCK) {
            this.$nextTick(() => {
              this.selfValue = PRODUCT_MAX_STOCK
            })
            return
          }
        }
        this.error = this.validator(newValue)
        this.triggerChange(newValue)
      }
    },
    methods: {
      triggerChange (value) {
        this.selfValue = value
        this.$emit('change', value)
        this.$emit('input', value)
      },
      handleSetZero () {
        this.triggerChange(0)
      },
      handleBlur () {
        if (this.selfValue === '-') {
          this.triggerChange()
        }
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
      width: auto;
    }
    /deep/ .boo-input {
      width: 100px;
      margin-right: 4px;
      display: inline-block;
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
