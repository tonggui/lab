<template>
  <ErrorBoundary :error="error" @refresh="getData" description="商品获取失败～">
    <Columns @delete="handleDelete" @edit-product="handleEdit" @edit-sku="handleEditSku">
      <template v-slot:default="{ columns }">
        <ProductList
          :sorting="sorting"
          :maxOrder="maxOrder"
          :productList="productList"
          :pagination="realPagination"
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
    </Columns>
  </ErrorBoundary>
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
  import ProductList from '@/views/components/product-list'
  import Columns from '@/views/merchant/components/product-columns'
  import store from '../../store'
  import lx from '@/common/lx/lxReport'
  import localStorage, { KEYS } from '@/common/local-storage'

  const initPagination = {
    ...defaultPagination,
    pageSize: localStorage[KEYS.MERCHANT_PRODUCT_LIST] || 20
  }

  export default {
    name: 'merchant-product-list-table',
    props: {
      sorting: Boolean,
      tagId: Number
    },
    data () {
      return {
        loading: false,
        error: false,
        productList: [],
        pagination: {
          ...initPagination
        }
      }
    },
    computed: {
      maxOrder () {
        return Math.min(200, this.pagination.total)
      },
      tabs () {
        return [{ name: '商家商品', count: this.pagination.total }]
      },
      // 排序情况下不需要有分页
      realPagination () {
        if (this.sorting) {
          return null
        }
        return this.pagination
      }
    },
    watch: {
      tagId () {
        this.pagination.current = 1
        this.getData()
      },
      sorting (sorting) {
        if (sorting) {
          this.pagination = { pageSize: 200, current: 1, total: 0 }
          store.productSort = {}
        } else {
          this.pagination = { ...initPagination }
        }
        this.getData()
      }
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { list, pagination } = await fetchGetProductList(this.tagId, this.pagination)
          if (this.sorting) {
            const sort = store.productSort[this.tagId]
            if (sort) {
              this.productList = sort.map((id) => list.find(i => i.id === id))
            } else {
              this.productList = list
            }
          } else {
            this.productList = list
          }
          this.pagination = pagination
          this.error = false
        } catch (err) {
          console.error(err)
          this.error = true
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async getSuggestionList (keyword) {
        const list = await fetchGetSearchSuggestion(keyword)
        return list
      },
      renderTabLabel (h, item) {
        return <div>{item.name} <span>{item.count}</span></div>
      },
      handleChangeList (list) {
        if (this.sorting) {
          store.productSort[this.tagId] = list.map(({ id }) => id)
        }
        this.productList = list
      },
      handleSearch (item) {
        this.$router.push({
          name: 'merchantSearchList',
          query: {
            tagId: item.tagId || '',
            brandId: item.brandId || '',
            keyword: item.name || '',
            dataType: item.type || ''
          }
        })
      },
      handlePageChange (pagination) {
        if (pagination.pageSize !== this.pagination.pageSize) {
          lx.mc({ bid: 'b_shangou_online_e_m0lr7zoj_mc', val: { type: pagination.pageSize } })
          localStorage[KEYS.MERCHANT_PRODUCT_LIST] = pagination.pageSize
        }
        this.pagination = pagination
        this.getData()
      },
      // 商品上下架
      handleEdit (product, params, index) {
        this.productList.splice(index, 1, {
          ...product,
          ...params
        })
      },
      handleEditSku (product, skuList, index) {
        this.productList.splice(index, 1, {
          ...product,
          skuList: skuList
        })
      },
      // 商品删除
      handleDelete (product, index) {
        this.getData()
        this.$emit('delete')
      }
    },
    components: {
      ProductList,
      Search,
      Columns
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
