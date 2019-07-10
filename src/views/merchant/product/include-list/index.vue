<template>
  <ProductList
    :loading="loading"
    :tag-list="tagList"
    :tag-id="tagId"
    :product-list="productList"
    :batch-operation="batchOperation"
    :columns="columns"
    @tag-id-change="id => tagId = id"
    @page-change="page => pagination = page"
    @batch="handleBatchOp"
  >
    <div class="header" slot="header">
      <h4>待收录商品</h4>
    </div>
  </ProductList>
</template>
<script>
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    fetchMerchantGetIncludeProductList,
    fetchMerchantSubmitIncludeProduct
  } from '@/data/repos/product'
  import { defaultPagination } from '@/data/constants/common'
  import ProductList from '@/views/components/search-list'
  import columns from './columns'

  const batchOperation = [{
    name: '收录',
    id: 'include'
  }]

  export default {
    name: 'merchant-include-list',
    data () {
      return {
        loading: true,
        error: false,
        tagList: [],
        productList: [],
        tagId: defaultTagId,
        pagination: { ...defaultPagination }
      }
    },
    computed: {
      batchOperation () {
        return batchOperation
      },
      columns () {
        const _slef = this
        return [...columns, {
          title: '操作',
          width: 150,
          align: 'center',
          render (h, { row }) {
            return h('a', {
              on: {
                click: (e) => {
                  e.preventDefault()
                  _slef.handleInclude([row.id])
                }
              }
            }, ['收录'])
          }
        }]
      }
    },
    components: {
      ProductList
    },
    watch: {
      tagId () {
        this.getData()
      },
      pagination (newValue, oldValue) {
        if (newValue.current !== oldValue.current ||
          newValue.pageSize !== oldValue.pageSize) {
          this.getData()
        }
      }
    },
    methods: {
      async getData (initial) {
        this.loading = true
        try {
          const { list, pagination, tagList } = await fetchMerchantGetIncludeProductList(this.tagId, this.pagination)
          this.productList = list
          if (initial) {
            this.tagList = tagList
          }
          this.pagination = pagination
          this.error = false
        } catch (err) {
          this.$Message.error(err.message || err)
          this.error = true
        } finally {
          this.loading = false
        }
      },
      async handleBatchOp (type, idList, cb) {
        await this.handleInclude(idList)
        cb()
      },
      async handleInclude (spuIdList) {
        try {
          await fetchMerchantSubmitIncludeProduct(spuIdList)
          this.$Message.success('收录成功')
          this.getData()
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      }
    },
    mounted () {
      this.getData(true)
    }
  }
</script>
<style lang="less" scoped>
.header {
  height: 60px;
  line-height: 60px;
  background: #FFF;
  border-bottom: 1px solid @border-color-base;
  padding-left: 20px;
}
</style>
