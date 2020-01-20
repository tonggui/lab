<template>
  <ErrorPage
    title="异常"
    :description="description"
    :button-text="buttonText"
    @refresh="handleRefresh"
  />
</template>
<script>
  import ErrorPage from './error'

  export default {
    name: 'default-error',
    components: { ErrorPage },
    props: {
      description: String,
      redirect: String,
      buttonText: String
    },
    methods: {
      handleRefresh () {
        if (!this.redirect) {
          window.location.reload()
          return
        }
        const { matched } = this.$router.match(this.redirect)
        if (matched && matched.length > 0) {
          this.$route.replace(this.redirect)
          return
        }
        window.location.href = this.redirect
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
