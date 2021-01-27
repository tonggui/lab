<template functional>
  <Breadcrumb separator=">" class="breadcrumb">
    <BreadcrumbItem>
      <router-link :to="{name: 'medicineMerchantList'}">商品管理</router-link>
    </BreadcrumbItem>
    <BreadcrumbItem><slot></slot></BreadcrumbItem>
  </Breadcrumb>
</template>
<style lang="less" scoped>
  .breadcrumb {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
