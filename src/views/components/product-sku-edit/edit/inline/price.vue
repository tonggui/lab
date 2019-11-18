<template>
  <div class="merchant-product-sku-edit-price" :class="{ error }">
    <UnitNumber unit="¥">
      <div>
        <InputNumber number v-model="selfValue" :max="max" :min="min" size="small" clearable />
        <div class="error" v-show="error">{{ error }}</div>
      </div>
    </UnitNumber>
  </div>
</template>
<script>
  import UnitNumber from '@components/unit-number'
  import {
    PRODUCT_MAX_PRICE,
    PRODUCT_MIN_PRICE,
    PRODUCT_PRICE_PRECISION
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
        selfValue: this.value,
        min: PRODUCT_MIN_PRICE,
        max: PRODUCT_MAX_PRICE
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
          const regx = new RegExp(`^(([1-9]\\d*)|0)(\\.\\d{0,${PRODUCT_PRICE_PRECISION}})?$`)
          if (!regx.test(newValue.toString())) {
            this.$nextTick(() => {
              this.selfValue = oldValue
            })
            return
          }
        }
        this.error = this.validator(newValue)
        this.handleChange(newValue)
      }
    },
    components: {
      UnitNumber
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
    /deep/ .boo-input-number {
      width: 100%;
    }
    /deep/ .boo-input-number-handler-wrap {
      display: none;
    }
    /deep/ .boo-input-wrapper-small .boo-input-prefix {
      font-size: @font-size-small;
      line-height: 28px;
      color: @text-tip-color;
    }
    &.error {
      /deep/ .boo-input-number {
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
