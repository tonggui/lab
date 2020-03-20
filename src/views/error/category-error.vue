<template>
  <ErrorPage
    title="异常"
    :invalid="invalid"
    :description="description"
    button-text="返回上一页"
    @refresh="goBack"
  />
</template>
<script>
  import ErrorPage from './error'

  export default {
    name: 'category-error',
    inject: ['appState'],
    components: { ErrorPage },
    computed: {
      invalid () {
        return this.$route.query.invalid && !!Number(this.$route.query.invalid)
      },
      description () {
        if (this.invalid) {
          return '商超生鲜商品管理与餐饮商品管理访问链接不同，请勿直接拼接门店ID访问，检查链接后重试'
        }
        return '门店经营品类异常'
      },
      isBusinessClient () {
        return this.appState.isBusinessClient
      }
    },
    mounted () {
      // !!!B端发生这样的错误需要上报
      if (this.isBusinessClient) {
        const error = new Error(this.description)
        window.onerror(error.message, 'unknow', 0, 0, error)
        console.error(error)
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
