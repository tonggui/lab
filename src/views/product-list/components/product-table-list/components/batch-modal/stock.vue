<template>
  <RadioGroup :value="type" @on-change="handleTypeChange">
    <Radio :label="0">无限</Radio>
    <Radio :label="1">
      具体库存<InputNumber :min="0" :value="stock" @on-change="handleValueChange" :precision="0" />
    </Radio>
  </RadioGroup>
</template>
<script>
  import { isInteger } from 'lodash'

  export default {
    name: 'modify-stock',
    props: {
      value: {
        type: Number,
        validator (value) {
          return isInteger(value) && value >= -1
        }
      }
    },
    computed: {
      type () {
        if (this.value === -1) {
          return 0
        }
        return 1
      },
      stock () {
        if (this.value === -1) {
          return undefined
        }
        return this.value
      }
    },
    methods: {
      triggerChange (value) {
        this.$emit('change', value)
        this.$emit('input', value)
      },
      handleTypeChange (type) {
        if (type === -1) {
          this.triggerChange(-1)
        }
      },
      handleValueChange (value) {
        this.triggerChange(value)
      }
    }
  }
</script>
