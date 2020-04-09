<template>
  <div class="edit-product-price" :class="{ error: showErrorTip && error }">
    <div>
      <Input ref="input" :clearable="clearable" :value="selfValue" @on-change="handleChange" :size="size" @on-blur="handleBlur">
        <span slot="prefix">¥</span>
      </Input>
      <template v-if="showErrorTip">
        <div class="error" v-show="error">{{ error }}</div>
      </template>
    </div>
  </div>
</template>
<script>
  import {
    isNumber
  } from 'lodash'
  import {
    PRODUCT_MAX_PRICE,
    PRODUCT_MIN_PRICE,
    PRODUCT_PRICE_PRECISION
  } from '@/data/constants/product'

  export default {
    name: 'edit-product-price',
    props: {
      value: [Number, String],
      validator: {
        type: Function,
        default: () => ''
      },
      size: {
        type: String,
        default: 'default',
        validator: (size) => ['default', 'small', 'large'].includes(size)
      },
      showErrorTip: {
        type: Boolean,
        default: true
      },
      min: {
        type: Number,
        default: PRODUCT_MIN_PRICE
      },
      max: {
        type: Number,
        default: PRODUCT_MAX_PRICE
      },
      precision: {
        type: Number,
        default: PRODUCT_PRICE_PRECISION
      },
      clearable: Boolean
    },
    data () {
      return {
        error: '',
        selfValue: isNumber(this.value) ? Number(this.value).toFixed(this.precision) : this.value
      }
    },
    watch: {
      value (value) {
        if (!value && value !== 0) {
          this.selfValue = ''
          return
        }
        if (!this.selfValue) {
          this.selfValue = this.precisionFormat(value)
          return
        }
        if (Number(this.selfValue) !== Number(this.value)) {
          this.selfValue = this.precisionFormat(value)
        }
      }
    },
    methods: {
      precisionFormat (value) {
        return Number(value).toFixed(this.precision)
      },
      validateNumber (value) {
        let error = ''
        const validNumberReg = /^(([1-9]\d*)|0)(\.\d*)?$/
        const validPrecisionReg = new RegExp(`^(([1-9]\\d*)|0)(\\.\\d{0,${this.precision}})?$`)
        // 校验是否输入非法字符
        if (!validNumberReg.test(value)) {
          error = '价格只能输入数字，且必须>=0'
        } else if (!validPrecisionReg.test(value)) {
          error = '小数点后最多2位'
        }
        return error
      },
      triggerChange (value) {
        if (value || value === 0) {
          value = Number(value)
        }
        this.$emit('change', value)
        this.$emit('input', value)
      },
      setInputRefValue (value) {
        this.$refs.input.currentValue = value
      },
      handleChange (e) {
        let newValue = e.target.value

        if (newValue === this.selfValue) {
          return
        }
        // 空值处理
        if (!newValue) {
          this.error = '价格不可以为空'
          this.selfValue = newValue
          this.$emit('on-error', this.error)
          this.triggerChange(this.selfValue)
          return
        }

        // 数字合法性校验
        const error = this.validateNumber(newValue)
        if (error) {
          this.error = error
          this.$emit('on-error', error)
          this.setInputRefValue(this.selfValue)
          return
        }

        if (newValue < this.min) { // 最小值校验
          const min = this.precisionFormat(this.min)
          this.error = `价格不允许低于${min}元`
          if (this.selfValue === min) {
            this.setInputRefValue(min)
          }
          this.selfValue = min
        } else if (newValue > this.max) { // 最大值校验
          const max = this.precisionFormat(this.max)
          this.error = `价格不允许超过${max}元`
          if (this.selfValue === max) {
            this.setInputRefValue(max)
          }
          this.selfValue = max
        } else {
          this.error = this.validator(Number(newValue)) || ''
          this.selfValue = newValue
        }

        this.$emit('on-error', this.error)
        this.triggerChange(this.selfValue)
      },
      handleBlur () {
        if (this.selfValue) {
          const formatValue = this.precisionFormat(this.selfValue)
          this.selfValue = formatValue
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';

  .edit-product-price {
    text-align: left;
    position: relative;
    /deep/ .boo-input {
      width: 100%;
    }
    /deep/ .boo-input-wrapper {
      color: @text-tip-color;
      &-default {
        .boo-input-with-prefix {
          padding-left: 24px;
        }
        .boo-input-prefix {
          font-size: @font-size-base;
          line-height: 34px;
          width: 24px;
        }
      }
      &-small .boo-input-prefix {
        font-size: @font-size-small;
        line-height: 28px;
      }
      &-large .boo-input-prefix {
        font-size: @font-size-large;
        line-height: 42px;
      }
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
