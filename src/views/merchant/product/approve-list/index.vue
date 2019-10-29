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
            @select="handleTagIdChange"
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
  import {
    fetchGetIncludeProductList,
    fetchSubmitIncludeProduct
  } from '@/data/repos/merchantProduct'
  import {
    fetchGetTagListByIncludeStatus
  } from '@/data/repos/merchantCategory'
  import {
    fetchGetAutoApproveStatus,
    fetchSubmitAutoApproveStatus
  } from '@/data/repos/merchantPoi'
  import {
    sleep
  } from '@/common/utils'
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    findTreeNodeById
  } from '@/common/arrayUtils'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductListTable from '@/components/product-list-table'
  import TagListLayout from '@/views/components/layout/tag-list'
  import TagTree from '@/components/tag-tree'
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
        tagId: defaultTagId,
        productTotalCount: 0,
        tag: {
          loading: false,
          error: false,
          list: []
        },
        product: {
          loading: false,
          error: false,
          list: [],
          pagination: { ...defaultPagination }
        },
        autoApprove: false
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
      ProductListPage,
      ProductListTable,
      TagListLayout,
      TagTree
    },
    methods: {
      async getProductList () {
        try {
          this.product.loading = true
          const { list, pagination } = await fetchGetIncludeProductList(this.tagId, this.product.pagination)
          this.product.list = list
          this.product.pagination = pagination
          this.product.error = false
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
          this.product.error = true
        } finally {
          this.product.loading = false
        }
      },
      async getTagList () {
        try {
          this.tag.loading = true
          const data = await fetchGetTagListByIncludeStatus()
          const { tagList, totalCount } = data
          this.tag.list = tagList
          this.productTotalCount = totalCount
          this.tag.error = false
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
          this.tag.error = true
        } finally {
          this.tag.loading = false
        }
      },
      async getAutoApproveStatus () {
        try {
          const status = await fetchGetAutoApproveStatus()
          this.autoApprove = status
        } catch (err) {
          console.error(err)
        }
      },
      async getData () {
        this.getTagList()
        this.getProductList()
        this.getAutoApproveStatus()
      },
      async updateIncludeData () {
        this.product.loading = true
        this.tag.loading = true
        await sleep(1000)
        await this.getTagList()
        if (this.tagId !== defaultTagId) {
          const hasTag = findTreeNodeById(this.tag.list, this.tagId)
          if (!hasTag) {
            this.handleTagIdChange(defaultTagId)
          } else {
            this.getProductList()
          }
        } else {
          this.getProductList()
        }
      },
      handleTagIdChange (id) {
        this.tagId = id
        this.product.pagination.current = 1
        this.getProductList()
      },
      handlePageChange (page) {
        this.product.pagination = page
        this.getProductList()
      },
      handleBatchOp ({ id }, idList, cb) {
        lx.mc({ bid: 'b_shangou_online_e_73q13wis_mc' })
        this.$Modal.confirm({
          title: '批量收录商品',
          content: `<p>选中${idList.length}个商品，是否确认将商品收录到商家商品库中？</p>`,
          onOk: async () => {
            // 最后一页 全选本页操作之后，分页需要往前推一页
            const { current, total, pageSize } = this.product.pagination
            if (current > 1 && idList.length >= this.product.list.length) {
              const maxPageCount = Math.ceil(total / pageSize)
              if (current >= maxPageCount) {
                this.product.pagination.current = maxPageCount - 1
              }
            }
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
      },
      async handleAutoApprove (status) {
        try {
          await fetchSubmitAutoApproveStatus(status)
          this.autoApprove = status
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || '自动收录设置失败！')
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
