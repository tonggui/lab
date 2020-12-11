<template>
  <div>
    <BatchEntrance :router-tag-id="routerTagId" />
    <NavigatorBar />
  </div>
</template>
<script>
  import BatchEntrance from './components/batch-entrance'
  import NavigatorBar from './components/navigator-bar'

  export default {
    name: 'merchant-product-list-header',
    computed: {
      routerTagId () {
        return this.$route.query.routerTagId
      }
    },
    components: {
      BatchEntrance,
      NavigatorBar
    }
  }
</script>
