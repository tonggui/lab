<template>
  <div>
    <div>关联商品</div>
    <div>
      <Table
        :dataSource="poiList"
      ></Table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'product-associated-poi'
}
</script>
