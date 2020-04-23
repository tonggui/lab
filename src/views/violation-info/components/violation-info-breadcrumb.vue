<template>
  <Breadcrumb separator=">" class="violation-info-breadcrumb">
    <BreadcrumbItem>
      <router-link class="bread-link" :to="{name: 'productList', query: { wmPoiId: poiId }}">商品管理</router-link>
    </BreadcrumbItem>
    <BreadcrumbItem><slot /></BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
  export default {
    name: 'violation-info-breadcrumb',
    computed: {
      poiId () {
        return this.$route.query.wmPoiId
      }
    }
  }
</script>

<style lang='less' scoped>
.violation-info-breadcrumb {
  margin-top: 10px;
  margin-bottom: 10px;
  .bread-link {
    color: @primary-color;
    cursor: pointer;
    &:hover {
      color: @link-hover-color;
    }
  }
}
</style>
