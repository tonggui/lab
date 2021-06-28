<template>
  <Breadcrumb separator=">" class="breadcrumb">
    <BreadcrumbItem>
      <router-link :to="{ name: isMedicine ? 'medicineMerchantList' : isSingle ? 'productList' :'merchantList', query:query }">商品管理</router-link>
    </BreadcrumbItem>
    <BreadcrumbItem><slot></slot></BreadcrumbItem>
  </Breadcrumb>
</template>
<script>
  import { getIsSingle } from '@/common/constants'
  export default {
    props: {
      isMedicine: Boolean
    },
    data () {
      return {
        isSingle: getIsSingle(),
        query: getIsSingle() ? {
          from: this.$route.query.from,
          wmPoiId: this.$route.query.wmPoiId
        } : this.$route.query
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
