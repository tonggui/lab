<template>
  <div class="product-audit-list">
    <div class="product-audit-list-header">
      <router-link :to="{ path: '/product/list', query: $route.query }"><Icon type="keyboard-arrow-left" size="20"/>返回商品管理</router-link>
    </div>
    <div class="product-audit-list-content">
      <ErrorBoundary :error="error" description="审核商品列表获取失败~" @refresh="getProductList">
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
          @page-change="handlePageChange"
          @tab-change="handleTabChange"
          @on-sort-change="handleSortChange"
        >
          <Input
            slot="tabs-extra"
            v-model="searchWord"
            :maxlength="PRODUCT_NAME_MAX_LENGTH"
            enter-button
            search
            placeholder="商品/UPC码/货号"
            clearable
            @on-search="handleSearch"
            class="product-audit-list-search"
          />
        </ProductTableList>
      </ErrorBoundary>
    </div>
  </div>
</template>
<script>
  import {
    fetchGetPoiAuditProductStatistics
  } from '@/data/repos/poi'
  import {
    fetchGetPoiAuditProductList
  } from '@/data/repos/product'
  import { PRODUCT_NAME_MAX_LENGTH } from '@/data/constants/product'
  import ProductTableList from '@components/product-list-table'
  import AuditProductOperation from './operation'
  import { defaultPagination } from '@/data/constants/common'
  import { tabList, defaultActiveTab } from './constants'
  import columns from './columns'

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
        searchWord: '',
        PRODUCT_NAME_MAX_LENGTH
      }
    },
    computed: {
      columns () {
        return [...columns, {
          width: 150,
          title: '操作',
          render: (h, { row }) => <AuditProductOperation product={row} vOn:cancel={this.handleCancelAudit} />
        }]
      }
    },
    methods: {
      renderTabLabel (h, item) {
        const { name, count, needDanger = false } = item
        return (
          <div>{name} <span class={needDanger ? 'danger' : ''}>{count}</span></div>
        )
      },
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
      },
      handleSortChange ({ column, key, order } = {}) {
        this.sort = {
          [key]: order
        }
        this.getProductList()
      },
      handlePageChange (page) {
        this.pagination = page
        this.getProductList()
      },
      handleTabChange (tab) {
        this.currentTab = tab
        this.pagination.current = 1
        this.getProductList()
      },
      handleSearch () {
        this.getProductList()
      },
      handleCancelAudit () {
        // 防止请求出空页
        if (this.productList.length <= 1 && this.pagination.current > 1) {
          this.pagination.current = this.pagination.current - 1
        }
        this.getProductList()
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
<style lang="less" scoped>
  .product-audit-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &-header {
      margin: 10px;
    }
    &-content {
      background: @component-bg;
      flex: 1;
      overflow: hidden;
    }
    &-search {
      margin-right: 20px;
    }
  }
</style>
