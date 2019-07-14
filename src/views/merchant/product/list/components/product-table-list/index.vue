<template>
  <ProductList
    :sorting="sorting"
    :productList="productList"
    :pagination="pagination"
    :tabs="tabs"
    :render-tab-label="renderTabLabel"
    :loading="loading"
    :columns="columns"
    :show-header="!sorting"
    @page-change="handlePageChange"
    @change-list="handleChangeList"
  >
    <div slot="tabs-extra" class="search">
      <Search
        @search="handleSearch"
        placeholder="商品名称/品牌/条码/货号"
        :fetch-data="getSuggestionList"
      />
    </div>
  </ProductList>
</template>
<script>
  import {
    defaultPagination
  } from '@/data/constants/common'
  import {
    fetchGetProductList,
    fetchGetSearchSuggestion
  } from '@/data/repos/merchantProduct'
  import Search from '@components/search-suggest'
  import ProductList from '@/views/components/sort-product-list'
  import ProductOperation from '@/views/merchant/components/product-table-opreation'
  import columns from './columns'

  export default {
    name: 'merchant-product-list-table',
    props: {
      sorting: Boolean,
      tagId: Number
    },
    data () {
      return {
        loading: false,
        productList: [],
        pagination: { ...defaultPagination }
      }
    },
    computed: {
      tabs () {
        return [{ name: '商家商品', count: this.pagination.total }]
      },
      columns () {
        return [...columns, {
          title: '操作',
          width: 200,
          align: 'center',
          render: (h, { row, index }) => {
            return <ProductOperation index={index} product={row} vOn:status={this.handleChangeStatus} vOn:delete={this.handleDelete} />
          }
        }]
      }
    },
    watch: {
      tagId () {
        this.pagination.current = 1
        this.getData()
      }
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { list, pagination } = await fetchGetProductList(this.tagId, this.pagination)
          this.productList = list
          this.pagination = pagination
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async getSuggestionList () {
        const list = await fetchGetSearchSuggestion()
        return list
      },
      renderTabLabel (h, item) {
        return <div>{item.name} <span>{item.count}</span></div>
      },
      handleChangeList (list) {
        this.productList = list
      },
      handleSearch (item) {
        this.$router.push({
          name: 'merchantSearchList',
          params: {
            tagId: item.tagId,
            brandId: item.id,
            keyword: item.name
          }
        })
      },
      handlePageChange (pagination) {
        this.pagination = pagination
        this.getData()
      },
      // 商品上下架
      handleChangeStatus (status, product, index) {
        this.productList.splice(index, 1, {
          ...product,
          sellStatus: status
        })
      },
      // 商品删除
      handleDelete (product, index) {
        this.getData()
      }
    },
    components: {
      ProductList,
      Search
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less" scoped>
  .search {
    margin-right: 20px;
    padding-top: 12px;
  }
</style>
