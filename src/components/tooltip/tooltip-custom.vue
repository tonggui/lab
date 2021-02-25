<template>
  <Tooltip :value="visible" :always="always" popper-class="custom-tooltip-container" :transfer="transfer" v-bind="$attrs" :max-width="maxWidth" :disabled="_disabled">
    <slot></slot>
    <template slot="content">
      <slot name="content">{{ content }}</slot>
      <div class="opreation"><slot name="operation"><a @click="handleClose">x</a></slot></div>
    </template>
  </Tooltip>
</template>
<script>
  import storage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'tooltip-custom',
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
      }
    },
    computed: {
      _disabled () {
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
<style lang="less">
  .custom-tooltip-container {
    .boo-tooltip-inner {
      max-width: 348px;
      background: #FF6A00;
      display: flex;
      padding: 16px;
    }
    &[x-placement^="bottom"] .boo-tooltip-arrow {
      border-bottom-color: #FF6A00 !important;
    }
  }
</style>
<style lang="less" scoped>
  .opreation {
    padding-left: 20px;
    a {
      color: #fff;
    }
    text-align: right;
    display: flex;
    align-items: center;
  }
</style>
