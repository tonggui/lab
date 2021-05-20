<template>
  <div class="new-batch-rel-container">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <Breadcrumb separator=">" class="breadcrumb">
        <BreadcrumbItem>
          <RouteLink to="/merchant/product/list" tag="a">总部商品列表</RouteLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          批量关联
        </BreadcrumbItem>
      </Breadcrumb>
      <MerchantUserGuide />
    </div>
    <div class="new-batch-rel-content">
      <h3 class="header">
        <span>批量关联</span>
<!--        <a class="right">批量关联教程 <Icon type="keyboard-arrow-right" /></a>-->
      </h3>
      <div class="inner">
        <Description />
        <Steps />
      </div>
    </div>
  </div>
</template>

<script>
  import RouteLink from '@components/link/link'
  import Description from './components/description'
  import Steps from './container/steps'
  import MerchantUserGuide from '@components/merchant-user-guide'

  export default {
    name: 'new-batch-rel',
    components: {
      RouteLink,
      Description,
      Steps,
      MerchantUserGuide
    }
  }
</script>

<style lang="less" scoped>
  .new-batch-rel-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .breadcrumb {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .new-batch-rel-content {
      background: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      .header {
        display: flex;
        justify-content: space-between;
        padding: 10px 32px 10px 22px;
        border-bottom: 1px solid #EEEEEE;
        .right {
          font-weight: 400;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #222222;
        }
      }
      .inner {
        padding: 10px 34px 56px 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - 116px);
        overflow: auto;
      }
    }
  }
</style>
