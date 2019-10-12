<template>
  <Tooltip ref="tooltip" :value="visible" :always="always" :transfer="transfer" v-bind="$attrs" :max-width="maxWidth" :disabled="disabled">
    <slot></slot>
    <template slot="content">
      <slot name="content">{{ content }}</slot>
      <div class="opreation"><a @click="handleClose">我知道了</a></div>
    </template>
  </Tooltip>
</template>
<script>
  import storage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'tooltip-with-localstorage',
    props: {
      keyName: String,
      content: String,
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
      }
    },
    computed: {
      disabled () {
        return storage[KEYS[this.keyName]]
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
