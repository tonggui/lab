<template>
  <WithCategoryTemplate guide="guide" />
</template>
<script>
  import withCategoryTemplate from '@/views/category-template'
  import Index from './manage-product-list'
  import { createNamespacedHelpers } from 'vuex'
  import store from '@/store'

  const { mapGetters } = createNamespacedHelpers('productList')

  export default {
    name: 'withCategoryTemplateManageProductList',
    components: {
      WithCategoryTemplate: withCategoryTemplate(Index)
    },
    created () {
      this.storeSubscribeAction = store.subscribeAction((action) => {
        if (action.type === 'categoryTemplate/successBroadcast') {
          window.location.reload()
        }
      })
    },
    computed: {
      ...mapGetters({
        guide: 'showCategoryTemplateGuideModal'
      })
    },
    beforeDestroy () {
      this.storeSubscribeAction()
    }
  }
</script>
