<template>
  <RadioGroup :disabled="disabled" :value="value" @on-change="handleChange">
    <Radio :disabled="disabled" :label="PRODUCT_SELL_STATUS.ON">上架</Radio>
    <Radio :disabled="disabled" :label="PRODUCT_SELL_STATUS.OFF">下架</Radio>
  </RadioGroup>
</template>
<script>
  import { PRODUCT_SELL_STATUS } from '@/data/enums/product'

  // 商品上/下架组件
  export default {
    name: 'sell-status',
    props: {
      disabled: Boolean,
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
