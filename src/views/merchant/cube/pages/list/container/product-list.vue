<template>
  <ProductTableList
    :maxSelect="maxSelect"
    :loading="loading"
    :pagination="pagination"
    :dataSource="dataSource"
    :selectedIdList="selectedIdList"
    @on-page-change="handlePageChange"
    @on-select="handleSelect"
    @on-de-select="handleDeSelect"
  />
</template>

<script>
  import ProductTableList from '../components/product-table-list'
  import { helper } from '../../../store'

  const { mapActions, mapState } = helper('multiCubeList/productList')

  export default {
    name: 'product-table-list-container',
    props: {
      maxSelect: {
        type: Number,
        default: 100
      },
      selectedIdList: Array
    },
    computed: {
      ...mapState({
        loading: 'loading',
        pagination: 'pagination',
        dataSource: 'list'
      })
    },
    components: {
      ProductTableList
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange'
      }),
      handleSelect (productList) {
        this.$emit('on-select', productList)
      },
      handleDeSelect (productList) {
        this.$emit('on-de-select', productList)
      }
    }
  }
</script>
