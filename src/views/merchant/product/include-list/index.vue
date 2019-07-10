<template>
  <Layout>
    <div class="header" slot="header">
      <h4>待收录商品</h4>
    </div>
    <TagList slot="tag-list" :loading="loading">
      <TagTree
        slot="content"
        :value="tagId"
        :dataSource="tagList"
        @select="handleTagIdChange"
        showAllData
      >
        <div slot="empty" class="empty">暂无分类</div>
      </TagTree>
    </TagList>
    <ProductTable
      slot="product-list"
      :batchOperation="batchOperation"
      :dataSource="productList"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @batch="handleBatchOp"
    />
  </Layout>
</template>
<script>
  import {
    fetchMerchantGetIncludeProductList,
    fetchMerchantSubmitIncludeProduct
  } from '@/data/repos/product'
  import { defaultTagId } from '@/data/constants/poi'
  import TagList from '@/views/components/product-list/layout/tag-list'
  import TagTree from '@components/tag-tree'
  import ProductTable from '@components/product-list-table'
  import Layout from '@/views/components/product-list/layout/page'
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
        tagId: defaultTagId,
        tagList: [],
        productList: [],
        pagination: {
          current: 1,
          pageSize: 20,
          total: 0,
          pageSizeOpts: [20, 50, 100],
          showElevator: true,
          showSizer: true
        }
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
      Layout,
      TagList,
      TagTree,
      ProductTable
    },
    methods: {
      async getData (initial = false) {
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
          this.error = true
        } finally {
          this.loading = false
        }
      },
      handleTagIdChange (id) {
        this.tagId = id
        this.getData()
      },
      handlePageChange (page) {
        this.pagination = page
        this.getData()
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
.empty {
  text-align: center;
  position: absolute;
  width: 100%;
  top: 40%;
}
</style>
