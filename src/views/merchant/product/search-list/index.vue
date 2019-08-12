<template>
  <div>
    <BreadcrumbHeader>搜索列表</BreadcrumbHeader>
    <ProductListPage>
      <div class="header" slot="header">
        <h4>搜索列表</h4>
        <div>
          <Search
            :default-value="keyword"
            @search="handleSearch"
            placeholder="商品名称/品牌/条码/货号"
            :fetch-data="getSuggestionList"
          />
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
        description="搜索商品获取失败～"
      >
        <ProductListTable
          :tagId="tagId"
          :dataSource="product.list"
          :columns="columns"
          :pagination="product.pagination"
          :loading="product.loading"
          @page-change="handlePageChange"
          show-header
        >
          <template slot="empty">
            <span v-if="!product.loading">没有搜索结果，换个词试试吧!</span>
          </template>
        </ProductListTable>
      </ErrorBoundary>
    </ProductListPage>
  </div>
</template>
<script>
  import {
    fetchGetProductListBySearch,
    fetchGetSearchSuggestion
  } from '@/data/repos/merchantProduct'
  import {
    fetchGetTagListBySearch
  } from '@/data/repos/merchantCategory'
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    sleep
  } from '@/common/utils'
  import {
    findTreeNodeById
  } from '@/common/arrayUtils'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import Search from '@components/search-suggest'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductListTable from '@/components/product-list-table'
  import TagListLayout from '@/views/components/layout/tag-list'
  import TagTree from '@/components/tag-tree'
  import ProductOperation from '@/views/merchant/components/product-table-operation'
  import columns from './columns'

  export default {
    name: 'merchant-search-list',
    data () {
      const {
        tagId,
        keyword,
        brandId
      } = this.getQueryData()
      return {
        tagId,
        keyword,
        brandId,
        productTotalCount: 0, // 全部商品数量
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
        }
      }
    },
    computed: {
      columns () {
        return [...columns, {
          title: '操作',
          width: 240,
          align: 'right',
          render: (h, { row, index }) => {
            return <div><ProductOperation index={index} product={row} vOn:status={this.handleChangeStatus} vOn:delete={this.handleDelete} /></div>
          },
          renderHeader: (h, { column }) => {
            return <span style={{ marginRight: '98px' }}>{ column.title }</span>
          }
        }]
      }
    },
    components: {
      ProductListPage,
      ProductListTable,
      TagListLayout,
      TagTree,
      Search,
      BreadcrumbHeader
    },
    methods: {
      getQueryData () {
        const query = this.$route.query || {}
        const tagId = Number(query.tagId || defaultTagId)
        const keyword = query.keyword || ''
        const brandId = query.brandId || 0
        return {
          tagId,
          keyword,
          brandId
        }
      },
      // 修改query
      changeQuery () {
        this.$router.replace({
          query: {
            ...this.$route.query,
            keyword: this.keyword,
            tagId: this.tagId,
            brandId: this.brandId
          }
        })
      },
      async getProductList () {
        try {
          this.product.loading = true
          const data = await fetchGetProductListBySearch(this.tagId, this.keyword, this.brandId, this.product.pagination)
          const { list, pagination } = data
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
          const data = await fetchGetTagListBySearch(this.keyword, this.brandId)
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
      async getData () {
        this.getTagList()
        this.getProductList()
      },
      // 获取搜索推荐
      async getSuggestionList () {
        const list = await fetchGetSearchSuggestion()
        return list
      },
      // 商品上下架
      handleChangeStatus (status, product, index) {
        this.product.list.splice(index, 1, {
          ...product,
          sellStatus: status
        })
      },
      // 商品删除
      async handleDelete (product, index) {
        this.product.loading = true
        this.tag.loading = true
        await sleep(1000)
        await this.getTagList()
        if (this.tagId !== defaultTagId) {
          const hasTag = findTreeNodeById(this.tag.list, this.tagId)
          if (!hasTag) {
            this.handleTagIdChange(defaultTagId)
          }
        } else {
          this.getProductList()
        }
      },
      // 分类切换
      handleTagIdChange (id) {
        this.tagId = id
        this.product.pagination.current = 1
        this.changeQuery()
        this.$nextTick(() => this.getProductList())
      },
      // 分页修改
      handlePageChange (page) {
        this.product.pagination = page
        this.getProductList()
      },
      // 搜索处理
      handleSearch ({ name, tagId, id }) {
        this.keyword = name
        this.tagId = tagId || defaultTagId
        this.brandId = id
        this.product.pagination.current = 1
        this.changeQuery()
        this.$nextTick(() => this.getData())
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
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
