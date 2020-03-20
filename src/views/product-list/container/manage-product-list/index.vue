<template>
  <WithCategoryTemplate v-bind="$attrs" v-on="$listeners" />
</template>
<script>
  import withCategoryTemplate from '@/views/category-template'
  import Index from './manage-product-list'
  import store from '@/store'

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
    beforeDestroy () {
      this.storeSubscribeAction()
    }
  }
</script>
