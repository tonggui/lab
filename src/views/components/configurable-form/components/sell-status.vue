<template>
  <RadioGroup :value="value" @on-change="handleChange">
    <Radio :label="PRODUCT_SELL_STATUS.ON">上架</Radio>
    <Radio :label="PRODUCT_SELL_STATUS.OFF">下架</Radio>
  </RadioGroup>
</template>
<script>
  import { PRODUCT_SELL_STATUS } from '@/data/enums/product'

  export default {
    name: 'sell-status',
    props: {
      value: Number
    },
    data () {
      return {
        PRODUCT_SELL_STATUS,
        selfValue: undefined
      }
    },
    methods: {
      handleChange (v) {
        this.$emit('change', v)
      }
    }
  }
</script>
