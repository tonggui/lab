<template>
  <div class="multi-store-page-layout" v-bind="$attrs">
    <div class="search-wrap">
        <ProductSearch></ProductSearch>
    </div>
    <div class="list-wrap">
        <ManageProductList></ManageProductList>
    </div>
  </div>
</template>
<script>
  import ProductSearch from './search'
  import ManageProductList from './manage-product-list'
  export default {
    name: 'product-list-page',
    components: {
      ProductSearch,
      ManageProductList
    }
  }
</script>
<style lang="less">
  .multi-store-page-layout {
    display: flex;
    flex-direction: column;
    color: @primary-color;
    min-height: 100%;
    // margin-bottom: 10px;
    .search-wrap{
      margin-bottom: 10px;
      padding: 20px 20px 56px 20px;
      background: #ffffff;
      margin-bottom: 10px;
    }
    .list-wrap {
      flex: 1;
      min-height: 500px;
      background: #fff;
    }
  }
</style>
