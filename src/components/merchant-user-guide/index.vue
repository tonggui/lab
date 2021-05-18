<template>
  <div class="merchant-user-guide">
<!--    <Tooltip type="custom" content="更多功能介绍，请点击这里学习哦~" keyName="MERCHANT_GUIDE_BOOK">-->
<!--      <a>-->
<!--        <Icon type="book" /> 遇到问题，查看"使用手册"-->
<!--      </a>-->
<!--    </Tooltip>-->
<!--    <span class="line" />-->
    <NamedLink tag="a" :name="batchPage">
      <Icon local="switch" /> 我想要使用"旧版商品管理工具"
    </NamedLink>
  </div>
</template>

<script>
  import BatchPage from '@sgfe/eproduct/navigator/pages/batch/create'
  import NamedLink from '@components/link/named-link'

  export default {
    name: 'merchant-user-head',
    data () {
      return {
        batchPage: BatchPage.name
      }
    },
    components: {
      NamedLink
    }
  }
</script>

<style lang="less" scoped>
  .merchant-user-guide {
    //display: flex;
    //justify-content: flex-end;
    color: @text-color-secondary;
    .line {
      display: inline-block;
      margin-left: 10px;
      margin-right: 10px;
      width: 1px;
      background: #E5E5E5;
      height: 14px;
      vertical-align: middle;
    }
    //> a {
    //  color: @text-color-secondary;
    //}
  }
</style>
