<template>
  <div class="product-recommend-edit">
    <div class="product-recommend-edit-nav">
      <div @click="handleGoBack">
        <Icon style="margin-top: -3px;" size="20" type="keyboard-arrow-left" />返回选择商品
      </div>
    </div>
    <ProductList :tag-group-product="tagGroupProduct" @delete="handleDelete" class="product-recommend-edit-list" />
  </div>
</template>
<script>
  import ProductList from './container/product-list'
  import { helper } from '../../store'

  const { mapState, mapActions } = helper()

  export default {
    name: 'product-recommend-edit-page',
    components: {
      ProductList
    },
    computed: {
      ...mapState({
        tagGroupProduct: 'classifySelectedProducts'
      })
    },
    methods: {
      ...mapActions({
        handleDelete: 'deSelectProduct'
      }),
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
    &-list {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
