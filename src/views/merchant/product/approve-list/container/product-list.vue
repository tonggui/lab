<template>
  <ErrorBoundary
    :error="error"
    @refresh="handleRefresh"
    description="待收录商品获取失败～"
  >
    <ProductListTable
      :tagId="tagId"
      :dataSource="list"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      :batch-operation="batchOperation"
      @page-change="handlePageChange"
      @batch="handleBatchOp"
      show-header
    >
      <template slot="empty">
        <span v-if="!loading">暂无待收录商品～</span>
      </template>
    </ProductListTable>
  </ErrorBoundary>
</template>
<script>
  import ProductListTable from '@/components/product-list-table'
  import ProductOperation from '../components/operation'
  import columns from '../columns'
  import { helper } from '../store'
  import lx from '@/common/lx/lxReport'

  const { mapActions, mapState } = helper('product')
  const { mapActions: listMapActions } = helper()

  const batchOperation = [{
    name: '批量收录',
    id: 'include'
  }, {
    name: '批量删除',
    id: 'delete',
    statistics: {
      bid: 'b_shangou_online_e_2wfgapmw_mc'
    }
  }]

  export default {
    name: 'merchant-approve-list-product-container',
    data () {
      return { batchOperation }
    },
    computed: {
      ...mapState(['error', 'tagId', 'loading', 'list', 'pagination']),
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
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleRefresh: 'getList'
      }),
      ...listMapActions({
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
          centerLayout: true,
          iconType: '',
          render: () => <p style="text-align: center">选中{idList.length}个商品，是否确认将商品收录到商家商品库中？</p>,
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
          centerLayout: true,
          iconType: '',
          render: () => <p style="text-align: center">选中{idList.length}个商品，确认将商品从总部删除（门店商品不删除）</p>,
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
    components: {
      ProductListTable
    }
  }
</script>
