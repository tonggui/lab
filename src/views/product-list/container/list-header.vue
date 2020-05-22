<template>
  <ListHeader :context="context" v-bind="$attrs" />
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ListHeader from '../components/list-header'

  const { mapGetters } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list-page-header-container',
    computed: {
      ...mapGetters(['currentTag', 'totalProductCount']),
      context () {
        return {
          totalProductCount: this.totalProductCount,
          tagId: this.currentTag.id
        }
      }
    },
    components: {
      ListHeader
    }
  }
</script>
