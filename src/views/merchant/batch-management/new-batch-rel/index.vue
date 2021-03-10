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
      <TagWithDataSelected class="tag-width-data-selected" />
    </div>
  </div>
</template>

<script>
  import RouteLink from '@components/link/link'
  import TagWithDataSelected from './tag-with-data-selected'
  export default {
    name: 'new-batch-rel',
    data () {
      return {}
    },
    methods: {
    },
    components: {
      RouteLink,
      TagWithDataSelected
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
      .tag-width-data-selected {
        width: 800px;
        height: 371px;
      }
    }
  }
</style>
