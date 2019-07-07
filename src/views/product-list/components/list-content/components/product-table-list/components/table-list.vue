<template>
  <Table
    class="product-list-table"
    v-bind="$attrs"
    v-on="$listeners"
  >
  </Table>
</template>
<script>
import Table from '@components/table-with-page'

export default {
  name: 'product-list-table',
  components: { Table }
}
</script>
<style lang="less">
  .product-list-table {
    .boo-table {
      th {
        color: @text-tip-color;
        background-color: #fff;
        padding: 16px 0;
      }
      th, td {
        border-bottom: none;
      }
      &-row {
        height: 90px;
      }
    }
  }
</style>
