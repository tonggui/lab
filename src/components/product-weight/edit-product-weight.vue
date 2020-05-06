<template>
  <div class="edit-product-weight" :class="{ error: showErrorTip && error }" :style="styles">
    <Input :class="inputClassNames" ref="input" :clearable="clearable" :placeholder="placeholder" :disabled="disabled" :value="weight" @on-change="handleWeightChange" @on-blur="handleWeightBlur">
      <Select transfer-class-name="edit-product-weight-select" transfer slot="append" :disabled="disabled" :value="unit" @on-change="handleUnitChange">
        <Option v-for="item in weightUnit" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </Input>
    <div class="error" v-if="showErrorTip">{{ error }}</div>
  </div>
</template>

<script>
  import { isString } from 'lodash'
  import { WEIGHT_UNIT } from '@/data/enums/product'
  import { WeightUnit } from '@/data/constants/product'

  export default {
    name: 'edit-product-weight',
    props: {
      value: Object,
      disabled: Boolean,
      placeholder: {
        type: String,
        default: '请输入'
      },
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
      clearable: Boolean,
      required: {
        type: Boolean,
        default: true
      },
      width: {
        type: [Number, String],
        default: '100%'
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
        weight: '',
        unit: this.value.unit
      }
    },
    watch: {
      'value.value': {
        immediate: true,
        handler (value) {
          if (!value && value !== 0) {
            this.weight = ''
            return
          }
          if (!this.weight) {
            this.weight = this.precisionFormat(value)
            return
          }
          if (Number(this.weight) !== Number(value)) {
            this.weight = this.precisionFormat(value)
          }
        }
      },
      'value.unit' (unit) {
        if (this.unit !== unit) {
          this.unit = unit
        }
      },
      unit () {
        if (!this.weight) {
          return
        }
        this.triggerWeightChange(this.weight)
      }
    },
    computed: {
      styles () {
        return {
          width: isString(this.width) ? this.width : `${this.width}px`
        }
      },
      inputClassNames () {
        return {
          'edit-product-weight-input': true,
          [`edit-product-weight-input-align-${this.textAlign || 'left'}`]: true
        }
      },
      weightUnit () {
        return WeightUnit
      },
      precision () {
        return [WEIGHT_UNIT.KG, WEIGHT_UNIT.L, WEIGHT_UNIT.JIN].includes(this.unit) ? 2 : 0
      }
    },
    methods: {
      triggerChange (value) {
        const newValue = {
          ...this.value,
          ...value
        }
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      },
      precisionFormat (value) {
        if (!value && value !== 0) {
          return ''
        }
        return Number(value).toFixed(this.precision)
      },
      setInputRefValue (value) {
        this.$refs.input.currentValue = value
      },
      // 把重量g转化成其他单位
      convertWeightUnit (weight, unit) {
        const weightTrans = {
          [WEIGHT_UNIT.G]: v => v,
          [WEIGHT_UNIT.ML]: v => v,
          [WEIGHT_UNIT.L]: v => v / 1000,
          [WEIGHT_UNIT.KG]: v => v / 1000,
          [WEIGHT_UNIT.P]: v => v / 454,
          [WEIGHT_UNIT.JIN]: v => v / 500,
          [WEIGHT_UNIT.LIANG]: v => v / 50
        }
        // TODO
        if (!weightTrans[unit]) {
          return weight
        }
        return Math.floor(weightTrans[unit](weight))
      },
      validateNumber (weight, unit) {
        let error = ''
        const numWeight = Number(weight)
        if (Number.isNaN(numWeight)) {
          return '只允许输入数字'
        }
        if (numWeight <= 0) {
          return '重量必须>0'
        }
        if (this.precision) {
          const reg = new RegExp(`^(([1-9]\\d*)|0)(\\.\\d{0,${this.precision}})?$`)
          if (!reg.test(weight)) {
            return `小数点后最多${this.precision}位`
          }
        } else {
          const reg = new RegExp(`^(([1-9]\\d*)|0)$`)
          if (!reg.test(weight)) {
            return '不允许输入小数'
          }
        }
        return error
      },
      handleUnitChange (unit) {
        this.unit = unit
        this.triggerChange({ unit })
      },
      handleWeightChange (e) {
        const newValue = e.target.value

        if (newValue === this.weight) {
          return
        }

        this.triggerWeightChange(newValue)
      },
      triggerWeightChange (newValue) {
        if (!newValue) {
          this.error = this.required ? '重量不能为空' : ''
          this.$emit('on-error', this.error)
          this.weight = newValue
          this.triggerChange(newValue)
          return
        }

        // 数字合法性校验
        const error = this.validateNumber(newValue, this.unit)
        if (error) {
          this.error = error
          this.$emit('on-error', error)
          const format = this.precisionFormat(this.weight)
          // 恢复input本地存储的值
          if (this.weight === format) {
            this.setInputRefValue(format)
          }
          this.weight = format
          return
        }
        // 最大值校验 200kg = 200000g
        const max = this.convertWeightUnit(200000, this.unit)
        const over = this.convertWeightUnit(10000, this.unit)
        if (newValue > max) {
          const formatMax = this.precisionFormat(max)
          this.error = `重量最大支持${formatMax}${this.unit}`
          if (this.weight === formatMax) {
            this.setInputRefValue(formatMax)
          }
          this.weight = formatMax
        } else if (newValue > over) {
          this.error = '重量过重'
          this.weight = newValue
        } else {
          this.error = this.validator(Number(newValue)) || ''
          this.weight = newValue
        }
        this.$emit('on-error', this.error)
        this.triggerChange(this.weight)
      },
      handleWeightBlur () {
        if (this.weight) {
          this.weight = this.precisionFormat(this.weight)
        }
      }
    }
  }
</script>
<style lang="less">
  .edit-product-weight-select {
    /deep/ .boo-select-item {
      font-size: @font-size-base !important;
    }
  }
</style>
<style lang="less" scoped>
  .edit-product-weight {
    /deep/ .boo-input-group-append {
      width: 100px;
      padding-left: 0;
      padding-right: 0;
    }
    &.error {
      /deep/ .boo-input,
      /deep/ .boo-input-group-append {
        border: 1px solid @error-color;
      }
      /deep/ .boo-input-group-append {
        border-left: none;
      }
    }
    .error {
      position: absolute;
      color: @error-color;
      font-size: @font-size-small;
      line-height: 1;
      margin-top: 4px;
    }
    &-input-align {
      &-right /deep/ input {
        text-align: right;
      }
      &-left /deep/ input {
        text-align: left;
      }
      &-center /deep/ input {
        text-align: center;
      }
    }
  }
</style>
