<template>
  <ProductList
    :product-list="list"
    :loading="loading"
    :error="error"
    :pagination="pagination"
    :tag-list="tagList"
    :type="type"
    :cache="cache"
    @refresh="getList"
    @delete="handleDelete"
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

  const { mapState, mapActions } = helper(TAB.EXIST)

  export default {
    name: 'exist-product-list-conatiner',
    props: {
      tagList: {
        type: Array,
        required: true
      }
    },
    computed: {
      ...mapState(['error', 'loading', 'list', 'pagination', 'cache']),
      type () {
        return TAB.EXIST
      }
    },
    components: {
      ProductList
    },
    methods: {
      ...mapActions({
        getList: 'getList',
        putOn: 'putOn',
        handleModify: 'modify',
        handleModifySku: 'modifySku',
        handlePageChange: 'changePage',
        handleDelete: 'delete'
      }),
      async handlePutOn (product) {
        await this.putOn(product)
        // 上架成功，列表中删除这个商品
        this.handleDelete(product)
        this.$emit('after-put-on')
      }
    },
    mounted () {
      this.getList()
    }
  }
</script>
