<template>
  <div class="edit-product-stock" :class="{ error: selfShowErrorTip && error }">
    <div class="edit-product-input">
      <Input :class="inputClassNames" :disabled="disabled" :placeholder="placeholder" ref="input" number :size="size" :value="selfValue" @on-change="handleChange" :clearable="clearable" @on-blur="handleBlur" />
      <span class="set-zero" @click="handleSetZero" v-if="withSetZero">归零</span>
    </div>
    <div class="error" v-if="selfShowErrorTip">{{ error }}</div>
    <small class="default-value-tip" v-if="isDefaultValue && defaultValueTip">{{ defaultValueTip }}</small>
  </div>
</template>
<script>
  import { isNumber } from 'lodash'
  import {
    PRODUCT_MAX_STOCK,
    PRODUCT_MIN_STOCK,
    PRODUCT_INFINITE_STOCK
  } from '@/data/constants/product'

  export default {
    name: 'edit-product-stock',
    props: {
      value: {
        type: [Number, String],
        validator: (value) => {
          return value === '' || isNumber(value)
        }
      },
      defaultValue: {
        type: [Number, String],
        validator: (value) => {
          return value === '' || isNumber(value)
        }
      },
      defaultValueTip: String,
      disabled: Boolean,
      validator: {
        type: Function,
        default: () => ''
      },
      size: {
        type: String,
        default: 'default',
        validator: (size) => ['default', 'small', 'large'].includes(size)
      },
      min: {
        type: Number,
        default: PRODUCT_MIN_STOCK
      },
      max: {
        type: Number,
        default: PRODUCT_MAX_STOCK
      },
      withSetZero: Boolean,
      showErrorTip: {
        type: Boolean,
        default: true
      },
      clearable: Boolean,
      placeholder: {
        type: String,
        default: '请输入'
      },
      textAlign: {
        type: String,
        default: 'left',
        validator: (layout) => ['left', 'right', 'center'].includes(layout)
      }
    },
    data () {
      return {
        error: '',
        selfValue: '',
        selfShowErrorTip: this.showErrorTip,
        isDefaultValue: this.defaultValue && !this.value
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (value) {
          // 无限库存，转化成最大值
          if (value === PRODUCT_INFINITE_STOCK) {
            this.setValue(this.max)
            return
          }
          if (this.isDefaultValue && this.value !== this.defaultValue) {
            this.setValue(this.defaultValue)
          } else if (this.selfValue !== value) {
            this.selfValue = value
          }
        }
      }
    },
    computed: {
      inputClassNames () {
        return {
          [`edit-product-input-align-${this.textAlign || 'left'}`]: true
        }
      }
    },
    methods: {
      setInputRefValue (value) {
        this.$refs.input.currentValue = value
      },
      validateNumber (newValue) {
        newValue = String(newValue)
        let error = ''
        // 校验整数库存
        const reg = /^(([1-9]\d*)|0)$/
        if (!reg.test(newValue) || newValue < this.min) {
          if (this.min === 0) {
            error = '库存只能输入整数，且必须>=0'
          } else {
            error = `库存只能输入整数，且必须>${this.min - 1}`
          }
        }
        return error
      },
      validateBorder (newValue) {
        let error = ''
        let value = newValue
        if (newValue < this.min) { // 最小值校验
          error = `库存不允许小于${this.min}`
          value = this.min
        } else if (newValue > this.max) { // 最大值校验
          error = `库存不允许超过${this.max}`
          value = this.max
        }
        return { error, value }
      },
      triggerChange (value) {
        if (value) {
          value = Number(value)
        }
        this.$emit('change', value)
        this.$emit('input', value)
      },
      setValue (newValue) {
        if (newValue === this.selfValue) {
          return
        }

        this.selfShowErrorTip = false

        // 空值处理
        if (!newValue && newValue !== 0) {
          this.error = '库存不可以为空'
          this.selfValue = newValue
          // this.$emit('on-error', this.error)
          this.triggerChange(this.selfValue)
          return
        }

        // 数字合法性检测
        const error = this.validateNumber(newValue)
        if (error) {
          this.error = error
          this.$emit('on-error', error)
          this.setInputRefValue(this.selfValue)
          return
        }

        // 边界校验
        const result = this.validateBorder(newValue)
        if (result.error) {
          this.error = result.error
          const { value } = result
          if (this.selfValue === value) {
            this.setInputRefValue(value)
          }
          this.selfValue = value
        } else { // 外部传入校验
          this.error = this.validator(newValue) || ''
          this.selfValue = newValue
        }

        this.$emit('on-error', this.error)
        this.triggerChange(this.selfValue)
      },
      handleChange (e) {
        const newValue = e.target.value
        this.setValue(newValue)
        this.isDefaultValue = false
      },
      handleSetZero () {
        this.selfValue = 0
        this.triggerChange(0)
      },
      handleBlur () {
        if (this.selfValue === '-') {
          this.triggerChange()
        }
        if (!this.selfValue && this.selfValue !== 0) {
          this.selfShowErrorTip = true
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';

  .edit-product-stock {
    text-align: left;
    position: relative;
    .edit-product-input {
      display: flex;
      align-items: center;
      &-align-right /deep/ input {
        text-align: right;
      }
      &-align-left /deep/ input {
        text-align: left;
      }
      &-align-center /deep/ input {
        text-align: center;
      }
    }
    /deep/ .boo-input-wrapper {
      width: auto;
      .boo-input-icon-clear {
        margin-right: 4px;
      }
    }
    /deep/ .boo-input {
      // width: 100px;
      margin-right: 4px;
      display: inline-block;
    }
    .set-zero {
      text-decoration: underline;
      font-size: @font-size-small;
      white-space: nowrap;
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
    .default-value-tip {
      .default-value-tip()
    }
  }
</style>
