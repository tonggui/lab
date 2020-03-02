<template>
  <div class="merchant-product-sku-edit-price" :class="{ error }">
    <div>
      <Input number v-model="selfValue" :size="size" clearable>
        <span slot="prefix" v-if="prefix">{{ prefix }}</span>
      </Input>
      <div class="error" v-show="error">{{ error }}</div>
    </div>
  </div>
</template>
<script>
  import {
    PRODUCT_MAX_PRICE,
    PRODUCT_MIN_PRICE,
    PRODUCT_PRICE_PRECISION
  } from '@/data/constants/product'

  export default {
    name: 'merchant-product-sku-edit-price',
    props: {
      value: [Number, String],
      validator: Function,
      size: {
        type: String,
        default: 'small'
      },
      prefix: {
        type: String,
        default: '¥'
      }
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
        if (newValue) {
          const reg = new RegExp(`^(([1-9]\\d*)|0)(\\.\\d{0,${PRODUCT_PRICE_PRECISION}})?$`)
          if (!reg.test(newValue.toString())) {
            this.$nextTick(() => {
              this.selfValue = oldValue
            })
            return
          }
          if (newValue < PRODUCT_MIN_PRICE) {
            this.$nextTick(() => {
              this.selfValue = PRODUCT_MIN_PRICE
            })
            return
          }
          if (newValue > PRODUCT_MAX_PRICE) {
            this.$nextTick(() => {
              this.selfValue = PRODUCT_MAX_PRICE
            })
            return
          }
        }
        this.error = this.validator && this.validator(newValue)
        this.handleChange(newValue)
      }
    },
    methods: {
      handleChange (value) {
        this.selfValue = value
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
    /deep/ .boo-input {
      width: 100%;
    }
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
