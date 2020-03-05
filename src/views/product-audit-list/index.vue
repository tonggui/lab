<template>
  <div>
    <header class="header">
      <Icon type="keyboard-arrow-left"/>返回商品管理
    </header>
    <ProductTableList
      :tabs="tabList"
      :table-value="currentTab"
      :render-tab-label="renderTabLabel"
      :columns="columns"
      :data-source="productList"
      :pagination="pagination"
      :loading="loading"
      table-fixed
      show-header
    />
  </div>
</template>
<script>
  import {
    fetchGetPoiAuditProductStatistics,
    fetchGetPoiAuditProductList
  } from '@/data/repos/poi'
  import ProductTableList from '@components/product-list-table'
  import { defaultPagination } from '@/data/constants/common'
  import { tabList, defaultActiveTab } from './constants'

  export default {
    name: 'product-audit-page',
    data () {
      return {
        tabList,
        productList: [],
        pagination: { ...defaultPagination },
        loading: false,
        error: false,
        currentTab: defaultActiveTab,
        searchWord: ''
      }
    },
    computed: {
      columns () {
        return []
      }
    },
    methods: {
      async getStatistics () {
        try {
          const data = await fetchGetPoiAuditProductStatistics()
          this.tabList = this.tabList.map((tab) => ({
            ...tab,
            count: data[tab.id]
          }))
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async getProductList () {
        try {
          this.loading = true
          this.error = false
          const { list, pagination } = await fetchGetPoiAuditProductList({
            searchWord: this.searchWord,
            auditStatus: this.currentTab,
            sort: this.sort
          }, this.pagination)
          this.productList = list
          this.pagination = pagination
        } catch (err) {
          console.error(err)
          this.error = true
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getStatistics()
      this.getProductList()
    },
    components: {
      ProductTableList
    }
  }
</script>
