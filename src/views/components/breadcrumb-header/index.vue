<template>
  <Breadcrumb separator=">" class="breadcrumb">
    <BreadcrumbItem>
      <router-link :to="{name: 'productList'}">商品管理</router-link>
    </BreadcrumbItem>
    <BreadcrumbItem v-if="!isMonitor">
      <router-link :to="{name: 'productMonitor'}">商品监测</router-link>
    </BreadcrumbItem>
    <BreadcrumbItem><slot /></BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
  export default {
    props: {
      isMonitor: { // 是否监控页
        type: Boolean,
        default: false
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
