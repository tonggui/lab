<template>
  <ProductList
    :loading="loading"
    :tag-list="tagList"
    :tag-id="tagId"
    :product-list="productList"
    :columns="columns"
    :pagination="pagination"
    @tag-id-change="handleChangeTagId"
    @page-change="handlePageChange"
  >
    <div class="header" slot="header">
      <h4>搜索列表</h4>
      <div>
        <Search :default-value="keyword" @search="handleSearch" placeholder="商品名称/品牌/条码/货号" :fetch-data="getSuggestionList" />
      </div>
    </div>
  </ProductList>
</template>
<script>
  import {
    fetchMerchantGetProductListBySearch,
    fetchMerchantGetSearchSuggestion
  } from '@/data/repos/product'
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import Search from '@components/search-suggest'
  import ProductList from '@/views/components/search-list'
  import columns from './columns'

  export default {
    name: 'merchant-search-list',
    data () {
      return {
        loading: true,
        tagId: this.$route.tagId || defaultTagId,
        tagList: [],
        productList: [],
        pagination: { ...defaultPagination }
      }
    },
    computed: {
      columns () {
        return columns
      },
      keyword () {
        return this.$route.query.keyword || ''
      }
    },
    components: {
      ProductList,
      Search
    },
    methods: {
      restPagination () {
        this.pagination.current = 1
      },
      async getData (initial = false) {
        try {
          this.loading = true
          if (initial) {
            this.restPagination()
          }
          const data = await fetchMerchantGetProductListBySearch(this.tagId, this.keyword, this.pagination)
          const { list, pagination, tagList } = data
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
      async getSuggestionList () {
        const list = await fetchMerchantGetSearchSuggestion()
        return list
      },
      handleChangeTagId (id) {
        this.tagId = id
        this.restPagination()
        this.getData()
      },
      handlePageChange (page) {
        this.pagination = page
        this.getData()
      },
      handleSearch ({ name, tagId }) {
        this.$router.replace({ query: { ...this.$route.query, keyword: name } })
        this.tagId = tagId || defaultTagId
        this.$nextTick(() => this.getData(true))
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
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
