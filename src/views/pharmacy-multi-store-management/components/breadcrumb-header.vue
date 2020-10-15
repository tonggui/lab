<template functional>
  <Breadcrumb separator=">" class="breadcrumb">
    <BreadcrumbItem>
      门店品类选择
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
