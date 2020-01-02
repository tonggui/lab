<template>
  <div class="number-range">
    <component number :is="inputComponent" v-model="minNumber" :style="inputStyle" @on-blur="handleMinBlur"></component>
    <span class="separator">{{ separator }}</span>
    <component number :is="inputComponent" v-model="maxNumber" :style="inputStyle" @on-blur="handleMaxBlur"></component>
  </div>
</template>
<script>
  import { isNumber } from 'lodash'
  export default {
    name: 'number-range',
    props: {
      precision: {
        type: Number,
        default: 2
      },
      min: {
        type: Number,
        default: -Infinity
      },
      max: {
        type: Number,
        default: Infinity
      },
      inputWidth: {
        type: Number,
        default: 100
      },
      separator: {
        type: String,
        default: '～'
      },
      inputType: {
        type: String,
        default: 'Input',
        validator: (type) => {
          return ['Input', 'InputNumber'].includes(type)
        }
      }
    },
    data () {
      return {
        minNumber: undefined,
        maxNumber: undefined
      }
    },
    watch: {
      minNumber (newValue, oldValue) {
        if (newValue) {
          const valid = this.numberValidator(newValue)
          if (!valid) {
            this.$nextTick(() => {
              this.minNumber = oldValue
            })
            return
          }
        }
        this.triggerChange(newValue, this.maxNumber)
      },
      maxNumber (newValue, oldValue) {
        if (newValue) {
          const valid = this.numberValidator(newValue)
          if (!valid) {
            this.$nextTick(() => {
              this.maxNumber = oldValue
            })
            return
          }
        }
        this.triggerChange(this.minNumber, newValue)
      }
    },
    computed: {
      inputComponent () {
        return this.inputType
      },
      inputStyle () {
        return {
          width: `${this.inputWidth}px`
        }
      }
    },
    methods: {
      triggerChange (minNumber, maxNumber) {
        this.$emit('change', [minNumber, maxNumber])
      },
      numberValidator (number) {
        const reg = new RegExp(`^(([1-9]\\d*)|0)(\\.\\d{0,${this.precision}})?$`)
        return reg.test(String(number))
      },
      handleMinBlur () {
        const min = this.min
        let max = this.max
        if (isNumber(this.maxNumber)) {
          max = Math.min(this.maxNumber, this.max)
        }
        const value = this.getValue(this.minNumber, { max, min })
        if (value !== this.minNumber) {
          this.$nextTick(() => {
            this.minNumber = value
          })
          this.triggerChange(value, this.maxNumber)
        }
      },
      handleMaxBlur () {
        const max = this.max
        let min = this.min
        if (isNumber(this.minNumber)) {
          min = Math.max(this.minNumber, this.min)
        }
        const value = this.getValue(this.maxNumber, { max, min })
        if (value !== this.maxNumber) {
          this.$nextTick(() => {
            this.maxNumber = value
          })
          this.triggerChange(this.minNumber, value)
        }
      },
      getValue (value, { min, max }) {
        if (value < min) {
          return min
        }
        if (value > max) {
          return max
        }
        return value
      }
    }
  }
</script>
<style lang="less" scoped>
  .number-range {
    .separator {
      margin-left: 5px;
      margin-right: 5px;
    }
  }
</style>
