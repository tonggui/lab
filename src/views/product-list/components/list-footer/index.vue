<template>
  <div>
    <FooterEvaluate :pageType="6" title="新版商品管理对您是否有帮助" />
  </div>
</template>
<script>
  import FooterEvaluate from '@components/footer-evaluate'

  export default {
    name: 'product-list-footer',
    components: {
      FooterEvaluate
    }
  }
</script>
