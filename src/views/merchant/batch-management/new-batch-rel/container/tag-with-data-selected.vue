<template>
  <div class="tag-with-data-selected-container">
    <SelectedProduct class="selected" />
    <TagWithDataTable class="table" />
  </div>
</template>

<script>
  import TagWithDataTable from './tag-with-data-table'
  import SelectedProduct from './selected-product'
  export default {
    name: 'tag-with-data-selected',
    components: {
      TagWithDataTable,
      SelectedProduct
    }
  }
</script>

<style lang="less" scoped>
  .tag-with-data-selected-container {
    width: 500px;
    //height: 371px;
    //display: flex;
    //justify-content: space-between;
    .table {
      width: 500px;
      height: 371px;
    }
    .selected {
      width: 100%;
      //width: 316px
    }
  }
</style>
