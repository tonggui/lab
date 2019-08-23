<template>
  <div class="footer">
    <StickyFooter v-if="sorting" :btnTexts="['完成']" :btnTypes="['primary']" @on-click="handleSubmit" />
    <FooterEvaluate v-else :pageType="6" title="新版商品管理对您是否有帮助" />
  </div>
</template>
<script>
  import StickyFooter from '@components/sticky-footer'
  import FooterEvaluate from '@components/footer-evaluate'

  export default {
    name: 'product-list-footer',
    props: {
      sorting: Boolean
    },
    components: {
      StickyFooter,
      FooterEvaluate
    },
    methods: {
      handleSubmit () {
        this.$emit('submit')
      }
    }
  }
</script>
<style lang="less" scoped>
  .footer {
    margin-top: 10px;
  }
</style>
