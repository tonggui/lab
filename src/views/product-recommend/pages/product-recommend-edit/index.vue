<template>
  <div class="product-recommend-edit">
    <div class="product-recommend-edit-nav">
      <div @click="handleGoBack"><Icon type="keyboard-arrow-left" />返回选择商品</div>
    </div>
    <div class="product-recommend-edit-content">
      <div class="product-recommend-edit-content-title">
        完善商品信息
        <small>本次已创建{{ createdCount }}个商品，剩余{{ remainingCount }}待创建</small>
      </div>
      <ProductList class="product-recommend-edit-content-list" />
    </div>
  </div>
</template>
<script>
  import ProductList from './container/product-list'

  export default {
    name: 'product-recommend-edit-page',
    data () {
      return {
        loading: false
      }
    },
    components: {
      ProductList
    },
    computed: {
      // TODO
      createdCount () {
        return 0
      },
      // TODO
      remainingCount () {
        return 100
      }
    },
    methods: {
      handleGoBack () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit {
    height: 100%;
    display: flex;
    flex-direction: column;
    &-nav {
      margin-bottom: 16px;
      display: flex;
    }
    &-content {
      flex: 1;
      overflow: hidden;
      background: @component-bg;
      display: flex;
      flex-direction: column;
      &-title {
        padding: 24px;
        font-size: 18px;
        color: #36394D;
        font-weight: 600;
        small {
          display: inline-block;
          font-size: @font-size-base;
          padding-left: 8px;
          margin-left: 24px;
          border-left: 1px solid #D8D8D8;
          line-height: 14px;
        }
      }
      &-list {
        flex: 1;
        overflow: hidden;
      }
    }
  }
</style>
