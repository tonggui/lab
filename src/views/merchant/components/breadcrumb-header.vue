<template>
  <Breadcrumb separator=">" class="breadcrumb">
    <BreadcrumbItem>
      <router-link :to="{ name: isMedicine ? 'medicineMerchantList' : 'merchantList', query:query }">商品管理</router-link>
    </BreadcrumbItem>
    <BreadcrumbItem><slot></slot></BreadcrumbItem>
  </Breadcrumb>
</template>
<script>
  export default {
    props: {
      isMedicine: Boolean
    },
    computed: {
      query () {
        return this.$route.query
      }
    }
  }
</script>
<style lang="less" scoped>
  .breadcrumb {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
