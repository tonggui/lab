<template>
  <div class="batch-entrance">
    <div>商品管理</div>
    <div>
      旧版批量功能
      <span class="line" />
      <NamedLink tag="a" :name="batchPage" :query="{ routerTagId }" v-mc="{ bid: 'b_shangou_online_e_act4ikmb_mc' }">
        点击进入<Icon type="keyboard-arrow-right" size="18"/>
      </NamedLink>
    </div>
  </div>
</template>
<script>
  import NamedLink from '@components/link/named-link'
  import BatchPage from '@sgfe/eproduct/navigator/pages/batch/create'
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
