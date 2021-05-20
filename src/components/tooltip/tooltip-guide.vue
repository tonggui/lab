<template>
  <Tooltip :value="visible" :always="always" :transfer="transfer" v-bind="$attrs" :max-width="maxWidth" :disabled="_disabled">
    <slot></slot>
    <template slot="content">
      <slot name="content">{{ content }}</slot>
      <div class="opreation"><slot name="operation"><a @click="handleClose">我知道了</a></slot></div>
    </template>
  </Tooltip>
</template>
<script>
  import storage, { KEYS, orders } from '@/common/local-storage'

  export default {
    name: 'tooltip-guide',
    props: {
      keyName: String,
      content: String,
      disabled: Boolean,
      transfer: {
        type: Boolean,
        default: true
      },
      value: {
        type: Boolean,
        default: true
      },
      maxWidth: {
        type: Number,
        default: 260
      },
      always: {
        type: Boolean,
        default: true
      },
      needOrders: Boolean,
      orders: Array
    },
    computed: {
      _disabled () {
        const customOrder = (this.orders && this.orders.length) ? this.orders : orders
        const findIndex = customOrder.findIndex(item => item === this.keyName)
        const previousGuideFinish = customOrder.slice(0, findIndex).every(item => storage[KEYS[item]])
        if (this.needOrders && !previousGuideFinish) return true
        return this.disabled || storage[KEYS[this.keyName]]
      },
      visible () {
        return this.$slots.default && this.value
      }
    },
    methods: {
      handleClose () {
        storage[KEYS[this.keyName]] = true
      }
    }
  }
</script>
<style lang="less" scoped>
  .opreation {
    text-align: right;
  }
</style>
