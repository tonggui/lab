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
  import WithPromiseEmit from '@/hoc/withPromiseEmit'
  import lx from '@/common/lx/lxReport'

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
      ProductList: WithPromiseEmit(ProductList)
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
        const { id } = await this.putOn(product)
        lx.mv({
          bid: 'b_shangou_online_e_3t0c6snc_mv',
          spu_id: id,
          st_spu_id: product.spId
        })
        // 上架成功，列表中删除这个商品
        this.handleDelete(product)
        this.$emit('after-put-on')
      }
    },
    mounted () {
      this.getList()
      lx.mv({ bid: 'b_shangou_online_e_mnagwu5n_mv' })
    }
  }
</script>
