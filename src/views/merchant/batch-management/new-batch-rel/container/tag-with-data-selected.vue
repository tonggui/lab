<template>
  <div class="tag-with-data-selected-container">
    <TagWithDataTable class="table" />
    <SelectedProduct class="selected" />
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
    width: 800px;
    height: 371px;
    display: flex;
    justify-content: space-between;
    .table {
      width: 474px;
    }
    .selected {
      width: 316px
    }
  }
</style>
