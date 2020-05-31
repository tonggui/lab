<template>
  <div class="product-recommend-edit-table-operation">
    <Button type="primary" @click="handleCreate" :disabled="disabled">创建</Button>
    <span class="operation-delete" @click="handleDelete">删除</span>
  </div>
</template>
<script>
  import { isIncompleteProductInfo } from '@/views/product-recommend/utils'

  export default {
    name: 'product-recommend-edit-table-operation',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      disabled () {
        return isIncompleteProductInfo(this.product)
      }
    },
    methods: {
      handleCreate () {
        this.$emit('create', this.product)
      },
      handleDelete () {
        this.$emit('delete', this.product)
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-table-operation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    white-space: nowrap;
    .operation-delete {
      text-decoration: underline;
      cursor: pointer;
      margin-left: 10px;
    }
  }
</style>
