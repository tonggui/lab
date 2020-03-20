export default {
  computed: {
    isMerchant () {
      return this.$route.fullPath.toLowerCase().indexOf('merchant') >= 0
    }
  }
}
