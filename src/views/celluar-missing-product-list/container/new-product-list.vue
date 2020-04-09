<template>
  <ProductList
    :product-list="list"
    :loading="loading"
    :error="error"
    :pagination="pagination"
    :tag-list="tagList"
    :type="type"
    @refresh="getList"
    @put-on="handlePutOn"
    @modify="handleModify"
    @modify-sku="handleModifySku"
    @page-change="handlePageChange"
  />
</template>
<script>
  import ProductList from '../components/product-list'
  import { helper } from '../store'
  import { TAB } from '../constants'

  const { mapState, mapActions } = helper(TAB.NEW)

  export default {
    name: 'new-product-list-conatiner',
    props: {
      tagList: {
        type: Array,
        required: true
      }
    },
    computed: {
      ...mapState(['error', 'loading', 'list', 'pagination']),
      type () {
        return TAB.NEW
      }
    },
    components: {
      ProductList
    },
    methods: {
      ...mapActions({
        getList: 'getList',
        handlePutOn: 'putOn',
        handleModify: 'modify',
        handleModifySku: 'modifySku',
        handlePageChange: 'changePage'
      })
    },
    mounted () {
      this.getList()
    }
  }
</script>
