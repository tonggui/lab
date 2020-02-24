<!-- 主要fix bootes input number 组件 默认值 1的问题
  采用null的hack方法
  因为Number(null) === 0 然后vue 也不渲染 null
 -->
<template>
  <InputNumber v-bind="$attrs" v-model="currentValue" v-on="$listeners" />
</template>
<script>
  import InputNumber from './index'

  export default {
    name: 'fix-input-number-precision',
    props: {
      value: Number,
      precision: Number
    },
    data () {
      return {
        currentValue: this.formatValue()
      }
    },
    watch: {
      value (newValue) {
        if (newValue !== this.currentValue) {
          const value = this.formatValue()
          this.currentValue = value
        }
      },
      currentValue (currentValue, oldValue) {
        if (currentValue) {
          const valid = this.numberValidator(currentValue)
          if (!valid) {
            this.$nextTick(() => {
              this.currentValue = oldValue
            })
            return
          }
        }
        this.triggerChange(currentValue)
      }
    },
    methods: {
      numberValidator (number) {
        const reg = new RegExp(`^(([1-9]\\d*)|0)(\\.\\d{0,${this.precision}})?$`)
        return reg.test(String(number))
      },
      triggerChange (value) {
        if (value !== this.value) {
          this.$emit('on-change', value)
          this.$emit('input', value)
        }
      },
      formatValue () {
        if (!this.value) {
          return this.value
        }
        if (this.precision) {
          const offset = Math.pow(10, this.precision)
          return Math.round(this.value * offset) / offset
        }
        return this.value
      }
    },
    components: {
      InputNumber
    }
  }
</script>
