<template>
  <RadioGroup :disabled="!havePermission || disabled" :value="value" @on-change="handleChange">
    <Radio :disabled="!havePermission || disabled" :label="PRODUCT_SELL_STATUS.ON">上架</Radio>
    <Radio :disabled="!havePermission || disabled" :label="PRODUCT_SELL_STATUS.OFF">下架</Radio>
  </RadioGroup>
</template>
<script>
  import { PRODUCT_SELL_STATUS } from '@/data/enums/product'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'
  // 商品上/下架组件
  export default {
    name: 'sell-status',
    props: {
      disabled: Boolean,
      value: Number,
      needPermission: {
        type: Boolean,
        default: true
      }
    },
    mixins: [getPermissionMixin('MODIFY_ON_AND_OFF_SHELVES')],
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
