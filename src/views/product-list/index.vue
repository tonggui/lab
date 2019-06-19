<template>
  <div class="list">
    <div>product list</div>
    <div>{{PRODUCT_MULTITAG}}</div>
    <named-link :name="recycleLinkName">test</named-link>
  </div>
</template>

<script>
import { PRODUCT_MULTITAG } from '@/common/cmm'
import withModules from '@/mixins/withModules'
import NamedLink from '@/components/link/named-link'
import productRecycle from '@sgfe/eproduct/navigator/pages/product/recycle'

export default {
  name: 'product-list',
  mixins: [
    withModules({
      PRODUCT_MULTITAG
    })
  ],
  components: {
    NamedLink
  },
  data () {
    return {
      recycleLinkName: productRecycle.name
    }
  }
}
</script>

<style scoped lang="less">
.list {
  color: @primary-color;
}
</style>
