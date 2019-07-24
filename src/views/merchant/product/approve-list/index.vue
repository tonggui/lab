<template>
  <div>
    <BreadcrumbHeader>待收录商品</BreadcrumbHeader>
    <ProductList
      :loading="loading"
      :product-loading="productLoading"
      :tag-list="tagList"
      :tag-id="tagId"
      :pagination="pagination"
      :product-list="productList"
      :batch-operation="batchOperation"
      :columns="columns"
      @tag-id-change="handleTagIdChange"
      @page-change="handlePageChange"
      @batch="handleBatchOp"
    >
      <div class="header" slot="header">
        <h4>待收录商品</h4>
      </div>
    </ProductList>
  </div>
</template>
<script>
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    fetchGetIncludeProductList,
    fetchSubmitIncludeProduct
  } from '@/data/repos/merchantProduct'
  import { defaultPagination } from '@/data/constants/common'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductList from '@/views/components/simple-product-list'
  import columns from './columns'
  import lx from '@/common/lx/lxReport'

  const batchOperation = [{
    name: '收录',
    id: 'include'
  }]

  export default {
    name: 'merchant-approve-list',
    data () {
      return {
        loading: false,
        productLoading: false,
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
          width: 100,
          align: 'right',
          render (h, { row }) {
            return h('a', {
              on: {
                click: (e) => {
                  e.preventDefault()
                  _slef.handleInclude([row.id])
                }
              },
              directives: [{
                name: 'mc',
                value: { bid: 'b_shangou_online_e_jpkf5kdl_mc' }
              }]
            }, ['收录'])
          }
        }]
      }
    },
    components: {
      BreadcrumbHeader,
      ProductList
    },
    methods: {
      restPagination () {
        this.pagination.current = 1
      },
      async getData (initial) {
        try {
          this.productLoading = true
          if (initial) {
            this.loading = true
          }
          const { list, pagination, tagList } = await fetchGetIncludeProductList(this.tagId, this.pagination)
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
          this.productLoading = false
        }
      },
      handleTagIdChange (id) {
        this.tagId = id
        this.restPagination()
        this.getData()
      },
      handlePageChange (page) {
        this.pagination = page
        this.getData()
      },
      async handleBatchOp (type, idList, cb) {
        lx.mc({ bid: 'b_shangou_online_e_73q13wis_mc' })
        this.$Modal.confirm({
          title: '批量收录商品',
          content: `<p>选中${idList.length}个商品，是否确认将商品收录到商家商品库中？</p>`,
          onOk: async () => {
            await this.handleInclude(idList)
            cb()
          }
        })
      },
      async handleInclude (spuIdList) {
        try {
          await fetchSubmitIncludeProduct(spuIdList)
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
