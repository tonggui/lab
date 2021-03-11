<template>
  <div class="new-batch-rel-container">
    <Breadcrumb separator=">" class="breadcrumb">
      <BreadcrumbItem>
        <RouteLink to="/" tag="a">总部商品列表</RouteLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        批量关联
      </BreadcrumbItem>
    </Breadcrumb>
    <div class="new-batch-rel-content">
      <h3>批量关联</h3>
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
  export default {
    name: 'new-batch-rel',
    data () {
      return {
      }
    },
    methods: {
    },
    components: {
      RouteLink,
      Description,
      Steps
    }
  }
</script>

<style lang="less" scoped>
  .new-batch-rel-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .breadcrumb {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .new-batch-rel-content {
      background: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      > h3 {
        padding: 34px 32px 16px 22px;
        border-bottom: 1px solid #EEEEEE;
      }
      .inner {
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - 116px);
      }
    }
  }
</style>
