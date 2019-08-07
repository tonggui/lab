<template>
  <div>
    <BreadcrumbHeader>待收录商品</BreadcrumbHeader>
    <ErrorBoundary :error="error" @refresh="getData" description="待收录商品获取失败～">
      <ProductList
        :loading="loading"
        :product-loading="productLoading"
        :tag-list="tagList"
        :tag-id="tagId"
        :pagination="pagination"
        :product-list="productList"
        :batch-operation="batchOperation"
        :columns="columns"
        :show-header="true"
        @tag-id-change="handleTagIdChange"
        @page-change="handlePageChange"
        @batch="handleBatchOp"
      >
        <div class="header" slot="header">
          <h4>待收录商品</h4>
        </div>
        <template slot="product-empty">暂无待收录商品～</template>
      </ProductList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import {
    fetchGetIncludeProductList,
    fetchSubmitIncludeProduct
  } from '@/data/repos/merchantProduct'
  import {
    sleep
  } from '@/common/utils'
  import {
    updateTreeNode
  } from '@/common/arrayUtils'
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductList from '@/views/components/simple-product-list'
  import columns from './columns'
  import lx from '@/common/lx/lxReport'

  const batchOperation = [{
    name: '批量收录',
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
      async getProductList () {
        try {
          this.productLoading = true
          const { list, pagination } = await fetchGetIncludeProductList(this.tagId, this.pagination)
          this.productList = list
          this.pagination = pagination
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.productLoading = false
        }
      },
      async getData () {
        try {
          this.loading = true
          this.tagId = defaultTagId
          this.pagination.current = 1
          const { list, pagination, tagList } = await fetchGetIncludeProductList(this.tagId, this.pagination)
          this.productList = list
          this.tagList = tagList
          this.pagination = pagination
          this.error = false
        } catch (err) {
          this.$Message.error(err.message || err)
          this.error = true
        } finally {
          this.loading = false
        }
      },
      async updateIncludeData () {
        try {
          this.productLoading = true
          await sleep(1000)
          const { list, pagination } = await fetchGetIncludeProductList(this.tagId, this.pagination)
          this.productList = list
          this.pagination = pagination
          if (this.tagId !== defaultTagId) {
            this.tagList = updateTreeNode(this.tagList, this.tagId, { productCount: pagination.total })
          }
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.productLoading = false
        }
      },
      handleTagIdChange (id) {
        this.tagId = id
        this.pagination.current = 1
        this.getProductList()
      },
      handlePageChange (page) {
        this.pagination = page
        this.getProductList()
      },
      handleBatchOp (type, idList, cb) {
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
          this.updateIncludeData()
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      }
    },
    mounted () {
      this.getData()
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
<style lang="less">
.approve-list-table-time-cell {
  padding-left: 40px;
}
</style>
