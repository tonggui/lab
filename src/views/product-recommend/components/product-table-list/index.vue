<template>
  <div class="product-table-list-container">
    <Header class="">
      <div slot="left">
      </div>
      <div slot="right">

      </div>
    </Header>
    <DoubleColumnsTableList :dataSource="dataSource">
      <div slot="header">
      </div>
    </DoubleColumnsTableList>
  </div>
</template>

<script>
  import DoubleColumnsTableList from '../double-columns-table-list'
  import Header from '@/components/header-layout'

  export default {
    name: 'product-table-list',
    components: {
      DoubleColumnsTableList,
      Header
    }
  }
</script>

<style scoped>

</style>
