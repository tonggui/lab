<template>
  <div class="product-cube">
    <Alert type="warning" class="product-cube-alert">
      <div>
        <span class="product-cube-tag">建品神器</span>
        <span class="product-cube-title">{{ title }}</span>
        <router-link class="product-cube-link" :to="{ name: 'productRecommend', query: $route.query }">去创建</router-link>
      </div>
      <div v-if="description" class="product-cube-description">
        <Icon size="14" local="horn" class="product-cube-horn-icon" />{{ description }}
      </div>
    </Alert>
  </div>
</template>
<script>
  export default {
    name: 'product-cube',
    props: {
      title: String,
      description: String
    }
  }
</script>
<style lang="less" scoped>
  .product-cube {
    background: @component-bg;
    &-alert {
      margin-bottom: 0;
      padding: 14px 20px;
      border-radius: 0;
    }
    &-tag {
      background: #FFECCF;
      border: 1px solid #F89800;
      border-radius: 0 2.5px 0 2.5px;
      color: #F88100;
      padding: 2px 4px;
      line-height: 20px;
      margin-right: 8px;
      font-size: @font-size-small;
    }
    &-title {
      color: #333333;
      font-weight: 600;
      margin-right: 4px;
    }
    &-link {
      text-decoration: underline;
    }
    &-description {
      margin-top: 8px;
      color: #676A78;
    }
    &-horn-icon {
      color: #F89800;
      margin-right: 8px;
    }
  }
</style>
