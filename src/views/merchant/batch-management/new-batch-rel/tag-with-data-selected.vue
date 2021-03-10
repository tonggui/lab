<template>
  <div class="tag-with-data-selected-container">
    <TagWithDataTable class="table" />
    <SelectedProduct class="selected" />
  </div>
</template>

<script>
  import TagWithDataTable from './container/tag-with-data-table'
  import SelectedProduct from './container/selected-product'
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
    margin-top: 100px;
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
