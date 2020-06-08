<template>
  <div><div v-if="error" class="product-recommend-edit-error-tips">{{ error }}</div></div>
</template>
<script>
  import {
    getUniqueId
  } from '@/views/product-recommend/utils'

  export default {
    name: 'product-recommend-edit-error',
    props: {
      product: {
        type: Object,
        required: true
      },
      errorInfo: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      error () {
        const id = getUniqueId(this.product)
        const info = this.errorInfo[id] && this.errorInfo[id].message
        return info ? `创建失败原因：${info}` : ''
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-error-tips {
    color: @error-color;
    white-space: nowrap;
    padding: 10px 0px 20px 60px;
    border-bottom: 1px solid @border-color-base;
  }
</style>
