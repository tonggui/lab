<template>
  <RadioGroup vertical :value="type" @on-change="handleTypeChange">
    <Radio :label="TYPE.Infinite">无限</Radio>
    <Radio :label="TYPE.Custom">具体库存<InputNumber :min="0" :value="stock" @on-change="handleValueChange" :precision="0" /></Radio>
  </RadioGroup>
</template>
<script>
  const TYPE = {
    Infinite: 0,
    Custom: 1
  }

  export default {
    name: 'product-batch-modify-stock',
    data () {
      return {
        value: -1
      }
    },
    computed: {
      TYPE () {
        return TYPE
      },
      type () {
        if (this.value === -1) {
          return TYPE.Infinite
        }
        return TYPE.Custom
      },
      stock () {
        if (this.value === -1) {
          return undefined
        }
        return this.value
      }
    },
    methods: {
      handleTypeChange (type) {
        if (type === TYPE.Infinite) {
          this.value = -1
        } else {
          this.value = undefined
        }
      },
      handleValueChange (value) {
        this.value = value
      },
      submit () {
        let error
        if (!this.value && this.value !== 0) {
          error = '库存不能为空'
        }
        this.$emit('submit', error, this.value)
      }
    }
  }
</script>
