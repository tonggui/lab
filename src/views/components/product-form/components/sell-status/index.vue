<template>
  <Select
    class="select"
    v-bind="$attrs"
    @on-change="handleChange"
  >
    <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>

<script>
  import { PRODUCT_SELL_STATUS } from '@/data/enums/product'

  export default {
    name: 'sell-status',
    computed: {
      options () {
        return [
          { value: PRODUCT_SELL_STATUS.ON, label: '售卖中' },
          { value: PRODUCT_SELL_STATUS.OFF, label: '暂停售卖' }
        ]
      }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
      }
    }
  }
</script>
