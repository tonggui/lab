<template>
  <Breadcrumb class="breadcrumb">
    <BreadcrumbItem><span class="to-route" @click="$emit('on-go-back')">商品管理</span></BreadcrumbItem>
    <BreadcrumbItem>{{text || '新店必建商品'}}</BreadcrumbItem>
  </Breadcrumb>
</template>
<script>
  export default {
    name: 'product-recommend-breadcrumb',
    props: {
      text: String
    }
  }
</script>

<style lang="less" scoped>
.breadcrumb {
  line-height: 14px;
  font-weight: normal;
  .to-route {
    text-decoration: underline;
    color: #858692;
    cursor: pointer;
  }
  /deep/ .boo-breadcrumb-item-link {
    font-weight: normal;
    color: #36384D;
  }
}
</style>
