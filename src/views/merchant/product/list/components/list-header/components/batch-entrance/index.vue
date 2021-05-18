<template>
  <div class="batch-entrance">
    <div>商品管理</div>
    <div>
<!--      旧版批量功能-->
<!--      <Tooltip type="custom" content="更多功能介绍，请点击这里学习哦~" keyName="MERCHANT_GUIDE_BOOK" :needOrders="true">-->
<!--        <a>-->
<!--          <Icon type="book" /> 遇到问题，查看"使用手册"-->
<!--        </a>-->
<!--      </Tooltip>-->
<!--      <span class="line" />-->
      <NamedLink tag="a" :name="batchPage" :query="{ routerTagId }" v-mc="{ bid: 'b_shangou_online_e_act4ikmb_mc' }">
<!--        点击进入<Icon type="keyboard-arrow-right" size="18"/>-->
        <Icon local="switch" /> 我想要使用"旧版商品管理工具"
      </NamedLink>
    </div>
  </div>
</template>
<script>
  import NamedLink from '@components/link/named-link'
  import BatchPage from '@sgfe/eproduct/navigator/pages/batch/create'
  import LocalStorage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'merchant-product-list-batch-entrance',
    props: {
      routerTagId: {
        type: [Number, String],
        required: true
      }
    },
    data () {
      return {
        batchPage: BatchPage.name
      }
    },
    computed: {
      showTooltip () {
        return !LocalStorage[KEYS.MERCHANT_OPEN_STATUS]
      }
    },
    components: {
      NamedLink
    }
  }
</script>
<style lang="less" scoped>
  .batch-entrance {
    display: flex;
    justify-content: space-between;
    color: @text-color-secondary;
    margin-top: 10px;
    margin-bottom: 10px;
    .line {
      display: inline-block;
      margin-left: 10px;
      margin-right: 10px;
      width: 1px;
      background: #E5E5E5;
      height: 14px;
      vertical-align: middle;
    }
  }
</style>
