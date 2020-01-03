<template>
  <div>
    <BreadcrumbHeader>待收录商品</BreadcrumbHeader>
    <ProductListPage>
      <div class="header" slot="header">
        <div>
          <h4>待收录商品</h4>
          <small>分店新增商品，会临时放在待收录，您可收录到总部商品库中</small>
        </div>
        <div>
          <span>自动收录</span>
          <Tooltip type="help" placement="bottom-end" :width="200" :offset="14" content="关联门店数≥2的商品，自动收录到总部商品库；总部操作删除商品时，选择的“删除总部商品”，不会自动收录">
            <iSwitch class="auto-switch" :value="autoApprove" @on-change="handleAutoApprove" />
          </Tooltip>
        </div>
      </div>
      <ErrorBoundary
        slot="tag-list"
        :error="tag.error"
        @refresh="getTagList"
        description="分类获取失败～"
      >
        <TagListLayout :loading="tag.loading">
          <TagTree
            slot="content"
            :value="tagId"
            :dataSource="tag.list"
            @select="handleTagChange"
            label-in-value
            showAllData
            :productCount="productTotalCount"
          >
            <template slot="empty">
              <Empty description="暂无分类" v-if="!tag.loading" />
            </template>
          </TagTree>
        </TagListLayout>
      </ErrorBoundary>
      <ErrorBoundary
        slot="product-list"
        :error="product.error"
        @refresh="getProductList"
        description="待收录商品获取失败～"
      >
        <ProductListTable
          :tagId="tagId"
          :dataSource="product.list"
          :columns="columns"
          :pagination="product.pagination"
          :loading="product.loading"
          :batch-operation="batchOperation"
          @page-change="handlePageChange"
          @batch="handleBatchOp"
          show-header
        >
          <template slot="empty">
            <span v-if="!product.loading">暂无待收录商品～</span>
          </template>
        </ProductListTable>
      </ErrorBoundary>
    </ProductListPage>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductListTable from '@/components/product-list-table'
  import TagListLayout from '@/views/components/layout/tag-list'
  import TagTree from '@/components/tag-tree'
  import ProductOperation from './components/operation'
  import columns from './columns'
  import lx from '@/common/lx/lxReport'

  const { mapActions, mapState, mapGetters } = createNamespacedHelpers('merchant-approve-list')

  const batchOperation = [{
    name: '批量收录',
    id: 'include'
  }, {
    name: '批量删除',
    id: 'delete'
  }]

  export default {
    name: 'merchant-approve-list',
    computed: {
      ...mapGetters(['productTotalCount', 'tagId']),
      ...mapState({
        autoApprove: 'autoApprove',
        tag: (state) => ({
          error: state.tag.error,
          loading: state.tag.loading,
          list: state.tag.list
        }),
        product: (state) => ({
          error: state.product.error,
          loading: state.product.loading,
          list: state.product.list,
          pagination: state.product.pagination
        })
      }),
      batchOperation () {
        return batchOperation
      },
      columns () {
        return [...columns, {
          title: '操作',
          width: 120,
          align: 'right',
          render: (h, { row }) => {
            return <ProductOperation product={row} vOn:delete={this.handleSingleDelete} vOn:include={this.handleSingleInclude} />
          }
        }]
      }
    },
    components: {
      BreadcrumbHeader,
      ProductListPage,
      ProductListTable,
      TagListLayout,
      TagTree
    },
    methods: {
      ...mapActions({
        getData: 'getData',
        destroy: 'destroy',
        handleAutoApprove: 'setAutoApprove',
        getTagList: 'getTagList',
        getProductList: 'getProductList',
        handleTagChange: 'changeCurrentTag',
        handlePageChange: 'changePagination',
        handleInclude: 'includeProduct',
        handleDelete: 'deleteProduct'
      }),
      async handleSingleInclude (product) {
        try {
          await this.handleInclude([product.id])
          this.$Message.success('收录成功')
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
          throw err
        }
      },
      async handleSingleDelete (product, { isMerchant }) {
        try {
          await this.handleDelete({
            productIdList: [product.id],
            isMerchant
          })
        } catch (err) {
          console.error(err)
          // this.$Message.error(err.message)
          throw err
        }
      },
      handleBatchOp ({ id }, idList, cb) {
        if (id === 'include') {
          return this.handleBatchInclude(idList, cb)
        }
        if (id === 'delete') {
          return this.handleBatchDelete(idList, cb)
        }
      },
      handleBatchInclude (idList, cb) {
        lx.mc({ bid: 'b_shangou_online_e_73q13wis_mc' })
        this.$Modal.confirm({
          title: '批量收录商品',
          render: () => <p>选中{idList.length}个商品，是否确认将商品收录到商家商品库中？</p>,
          onOk: async () => {
            try {
              await this.handleInclude(idList)
              cb()
              this.$Message.success('批量收录成功')
            } catch (err) {
              console.error(err)
              this.$Message.error(err.message)
              throw err
            }
          }
        })
      },
      handleBatchDelete (idList, cb) {
        this.$Modal.confirm({
          title: '批量删除商品',
          render: () => <p>选中{idList.length}个商品，是否确认将商品总部删除？</p>,
          onOk: async () => {
            try {
              await this.handleDelete({ productIdList: idList, isMerchant: true })
              cb()
              this.$Message.success('批量删除成功')
            } catch (err) {
              console.error(err)
              this.$Message.error(err.message)
              throw err
            }
          }
        })
      }
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
<style lang="less" scoped>
.header {
  height: 60px;
  background: #FFF;
  border-bottom: 1px solid @border-color-base;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    display: inline-block;
  }
  small {
    color: @text-description-color;
    margin-left: 10px;
  }
  .auto-switch {
    margin-left: 10px;
  }
}
</style>
<style lang="less">
.approve-list-table-time-cell {
  padding-left: 40px;
}
</style>
