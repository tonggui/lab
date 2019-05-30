<template>
  <div class="list">
    <div>product list</div>
    <named-link :name="recycleLinkName">test</named-link>
  </div>
</template>

<script>
import NamedLink from '@/components/link/named-link'
import productRecycle from '@sgfe/eproduct/navigator/pages/product/recycle'

export default {
  name: 'product-list',
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
