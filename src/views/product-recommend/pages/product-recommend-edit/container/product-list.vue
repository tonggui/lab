<template>
  <ProductList :groupData="groupData" @modify-product="handleModifyProduct" @modify-sku="handleModifySku" />
</template>
<script>
  import ProductList from '../components/product-list'
  import { helper } from '../../../store'

  const { mapActions, mapGetters } = helper()

  export default {
    name: 'product-recommend-edit-table-container',
    components: {
      ProductList
    },
    computed: {
      ...mapGetters({
        groupData: 'editProductGroupList'
      })
    },
    methods: {
      ...mapActions({
        handleModifyProduct: 'modifyProduct',
        handleModifySku: 'modifySku'
      })
    }
  }
</script>
