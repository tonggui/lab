<template>
  <div class="hot-recommend">
    <div class="hot-recommend-close" @click="handleClose"><Icon type="close" /></div>
    <div class="hot-recommend-title">新店开业，必建商品</div>
    <div>
      根据您经营的品类，为您推荐了必建商品，可快速新建多个商品，
      <NamedLink tag="a" :name="hotRecommendPageName()">
        <span v-mc="{ bid: 'b_usrt8g13' }">请戳这里&nbsp;&gt;&gt;</span>
      </NamedLink>
    </div>
  </div>
</template>
<script>
  import NamedLink from '@components/link/named-link'
  import hotRecommendPage from '@sgfe/eproduct/navigator/pages/product/hotRecommend'

  export default {
    name: 'hot-recommend',
    components: {
      NamedLink
    },
    methods: {
      handleClose () {
        this.$emit('close')
      },
      hotRecommendPageName () {
        return hotRecommendPage.name
      }
    }
  }
</script>
<style lang="less">
  .hot-recommend {
    background: @component-bg;
    margin: 10px 0;
    padding: 20px;
    position: relative;
    &-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    &-close {
      left: 0;
      right: 10px;
      top: 5px;
      position: absolute;
      text-align: right;
      i {
        cursor: pointer;
      }
    }
  }
</style>
