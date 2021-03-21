<template>
  <div class="tag-with-data-selected-container">
    <SelectedProduct
      class="selected"
      :productData="productData"
      @clear="handleClear"
    />
    <TagWithDataTable
      class="table"
      :productData="productData"
      @data-change="handleDataChange"
    />
  </div>
</template>

<script>
  import TagWithDataTable from './tag-with-data-table'
  import SelectedProduct from './selected-product'
  export default {
    name: 'tag-with-data-selected',
    props: {
      productData: Object
    },
    components: {
      TagWithDataTable,
      SelectedProduct
    },
    methods: {
      handleDataChange (key, val) {
        this.$emit('data-change', val, 'productData')
      },
      handleClear () {
        this.$emit('data-change', Object.assign({}), 'productData')
      }
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
