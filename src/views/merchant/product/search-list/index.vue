<template>
  <div>
    <BreadcrumbHeader>搜索列表</BreadcrumbHeader>
    <ErrorBoundary :error="error" @refresh="getData" description="搜索商品获取失败～">
      <ProductList
        :loading="loading"
        :product-loading="productLoading"
        :tag-list="tagList"
        :tag-id="tagId"
        :product-list="productList"
        :columns="columns"
        :pagination="pagination"
        :show-header="true"
        @tag-id-change="handleChangeTagId"
        @page-change="handlePageChange"
      >
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
        <template slot="product-empty">
          <span>没有搜索结果，换个词试试吧!</span>
        </template>
      </ProductList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import {
    fetchGetProductListBySearch,
    fetchGetSearchSuggestion
  } from '@/data/repos/merchantProduct'
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    sleep
  } from '@/common/utils'
  import {
    updateTree
  } from '@/common/arrayUtils'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import Search from '@components/search-suggest'
  import ProductList from '@/views/components/simple-product-list'
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
        loading: true,
        productLoading: false,
        error: false,
        tagList: [],
        productList: [],
        pagination: { ...defaultPagination }
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
      ProductList,
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
          this.productLoading = true
          const data = await fetchGetProductListBySearch(this.tagId, this.keyword, this.brandId, this.pagination)
          const { list, pagination } = data
          this.productList = list
          this.pagination = pagination
        } catch (err) {
          this.productList = []
        } finally {
          this.productLoading = false
        }
      },
      // 获取数据
      async getData () {
        try {
          this.loading = true
          const {
            list,
            pagination,
            tagList
          } = await fetchGetProductListBySearch(this.tagId, this.keyword, this.brandId, this.pagination)
          this.productList = list
          this.tagList = tagList
          this.pagination = pagination
          this.error = false
        } catch (err) {
          this.error = true
        } finally {
          this.loading = false
          this.productLoading = false
        }
      },
      // 获取搜索推荐
      async getSuggestionList () {
        const list = await fetchGetSearchSuggestion()
        return list
      },
      // 商品上下架
      handleChangeStatus (status, product, index) {
        this.productList.splice(index, 1, {
          ...product,
          sellStatus: status
        })
      },
      // 商品删除
      async handleDelete (product, index) {
        try {
          this.productLoading = true
          await sleep(1000)
          const {
            list,
            pagination,
            tagList
          } = await fetchGetProductListBySearch(this.tagId, this.keyword, this.brandId, this.pagination)
          this.productList = list
          this.pagination = pagination
          if (this.tagId !== defaultTagId) {
            this.tagList = updateTree(this.tagList, tagList)
          } else {
            this.tagList = tagList
          }
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.productLoading = false
        }
      },
      // 分类切换
      handleChangeTagId (id) {
        this.tagId = id
        this.pagination.current = 1
        this.changeQuery()
        this.$nextTick(() => this.getProductList())
      },
      // 分页修改
      handlePageChange (page) {
        this.pagination = page
        this.getProductList()
      },
      // 搜索处理
      handleSearch ({ name, tagId, id }) {
        this.keyword = name
        this.tagId = tagId || defaultTagId
        this.brandId = id
        this.pagination.current = 1
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
