<template>
  <div>
    <!-- <p>门店异常商品数目: {{ text1 }}</p>
    <p>图文详情开关: {{ text2 }}</p>
    <p>多分类个数: {{ text3 }}</p>
    <p>商品视频: {{ text4 }}</p>
    <p>购物袋设置: {{ text5 }}</p> -->
    <p>中间态商品: {{ text6 }}</p>
    <!-- <p>风控: {{ text7 }}</p>
    <p>未关联商品数: {{ text8 }}</p>
    <p>分类模版入口: {{ text9 }}</p>
    <p>热卖推荐: {{ text10 }}</p>
    <p>门店异常: {{ text11 }}</p> -->
  </div>
</template>
<script>
  import * as type from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'cmm-demo',
    computed: {
      ...mapModule({
        // text1: type.POI_ERROR_PRODUCT_COUNT,
        // text2: type.PRODUCT_PICTURE_CONTENT,
        // text3: type.PRODUCT_TAG_COUNT,
        // text4: type.PRODUCT_VIDEO,
        // text5: type.POI_SHOPPING_BAG,
        text6: type.POI_TRANSITION_PRODUCT
        // text7: type.POI_RISK_CONTROL,
        // text8: type.POI_UN_RELATION_PRODUCT_COUNT,
        // text9: type.CATEGORY_TEMPLATE,
        // text10: type.POI_HOT_RECOMMEND,
        // text11: type.POI_VIOLATION
      })
    },
    mounted () {
      console.log('vvvv:', this)
    }
  }
</script>
<style lang="less" scoped>
  .text {
    color: red
  }
</style>
