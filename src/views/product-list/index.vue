<template>
  <div class="list">
    product list
    {{PRODUCT_MULTITAG}}
  </div>
</template>

<script>
import { PRODUCT_MULTITAG } from '@/common/cmm'
import withModules from '@/mixins/withModules'
export default {
  name: 'product-list',
  mixins: [
    withModules(PRODUCT_MULTITAG)
  ]
}
</script>

<style scoped lang="less">
.list {
  color: @primary-color;
}
</style>
