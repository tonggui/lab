<template>
  <div class="product-audit-list">
    <div class="product-audit-list-header">
      <slot name="breadcrumb">
        <Breadcrumb separator=">">
          <BreadcrumbItem>
            <router-link :to="{ path: '/product/list', query: $route.query }">商品管理</router-link>
          </BreadcrumbItem>
          <BreadcrumbItem>商品审核</BreadcrumbItem>
        </Breadcrumb>
      </slot>
    </div>
    <div class="product-audit-list-content">
      <Tabs :value="currentTab.id" @on-click="handleTabChange" class="product-audit-list-tabs">
        <template v-for="item in selfTabList">
          <TabPane
            :label="h => renderTabLabel(h, item)"
            :name="item.id"
            :key="item.id"
          />
        </template>
        <div slot="extra" class="product-audit-list-tabs-extra">
          <Search
            v-model="searchWord"
            :fetch-data="getSuggestionList"
            :placeholder="placeholder"
            @search="handleSearch"
            class="product-audit-list-search"
          />
          <Button @click="handleClearSearch" size="large" class="product-audit-list-clear">清空搜索</Button>
        </div>
      </Tabs>
      <ErrorBoundary class="product-audit-list-table-container" :error="error" description="审核列表数据获取失败～" @refresh="getProductList">
        <Table
          :columns="columns"
          :data="productList"
          :pagination="pagination"
          :loading="loading"
          show-header
          border
          @on-page-change="handlePageChange"
          class="product-audit-list-table"
          ref="table"
          table-fixed
          need-scroll-top
        >
          <template v-slot:operation="{ row }">
            <slot name="operation" :row="row" :on-delete="handleCancel"></slot>
          </template>
        </Table>
      </ErrorBoundary>
    </div>
  </div>
</template>
<script>
  import lx from '@/common/lx/lxReport'
  import { isFunction } from 'lodash'
  import Search from '@components/search-suggest'
  import Table from '@components/table-with-page'
  import { defaultPagination } from '@/data/constants/common'

  export default {
    name: 'audit-product-list',
    props: {
      columns: {
        type: Array,
        required: true
      },
      tabList: {
        type: Array,
        required: true
      },
      defaultActiveTab: {
        type: String,
        required: true
      },
      server: {
        type: Object,
        required: true,
        validator: (server) => {
          return ['getStatistics', 'getList', 'getSearchSuggestion'].every(k => isFunction(server[k]))
        }
      },
      placeholder: {
        type: String,
        default: '商品/UPC码/货号'
      }
    },
    data () {
      const currentTab = this.tabList.find(tab => tab.id === this.defaultActiveTab) || {}
      return {
        productList: [],
        pagination: { ...defaultPagination },
        loading: false,
        error: false,
        searchWord: '',
        currentTab,
        selfTabList: [...this.tabList],
        getSuggestionList: this.server.getSearchSuggestion
      }
    },
    computed: {
      auditStatus () {
        return (this.currentTab || {}).statusList || []
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
          const data = await this.server.getStatistics()
          this.selfTabList = this.selfTabList.map((tab) => {
            const count = (tab.statusList || [])
              .reduce((prev, status) => prev + (data[status] || 0), 0)
            return {
              ...tab,
              count
            }
          })
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async getProductList () {
        try {
          this.loading = true
          this.error = false
          const { list, pagination } = await this.server.getList({
            searchWord: this.searchWord,
            auditStatus: this.auditStatus,
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
      handleClearSearch () {
        this.searchWord = ''
        this.pagination.current = 1
        this.getProductList()
      },
      handlePageChange (page) {
        this.pagination = page
        this.getProductList()
      },
      handleTabChange (tab) {
        this.currentTab = this.selfTabList.find(t => t.id === tab) || {}
        if (this.currentTab.statistics) {
          lx.mc(this.currentTab.statistics)
        }
        this.pagination.current = 1
        this.$emit('tab-change', tab)
        this.getProductList()
      },
      handleSearch (item) {
        this.searchWord = item.name
        this.pagination.current = 1
        this.getProductList()
      },
      /**
       * 撤销审核后重新获取列表数据
       */
      handleCancel () {
        // 防止请求出空页
        if (this.productList.length <= 1 && this.pagination.current > 1) {
          this.pagination.current = this.pagination.current - 1
        }
        // 延迟一秒？
        this.getProductList()
        // 撤销了，说明审核中少了一个，撤销多了一个
        this.getStatistics()
      }
    },
    mounted () {
      this.getStatistics()
      this.getProductList()
    },
    components: {
      Table,
      Search
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
      margin-bottom: 10px;
    }
    &-tabs {
      height: 62px;
      flex-shrink: 0;
      /deep/ .boo-tabs-bar {
        margin-bottom: 0;
        .boo-tabs-nav-wrap.boo-tabs-nav-scrollable {
          display: flex;
          align-items: center;
          .boo-tabs-nav-next,
          .boo-tabs-nav-prev {
            transform: translateY(-2px);
          }
        }
      }
      /deep/ .boo-tabs-nav .boo-tabs-tab {
        padding: 20px 4px 21px 20px;
      }
    }
    &-tabs-extra {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      height: 61px;
      margin-right: 20px;
    }
    &-content {
      background: @component-bg;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    &-table-container {
      flex: 1;
      height: auto;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    &-table {
      // height: 100%;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      /deep/ .empty {
        margin-top: 200px;
      }
      /deep/ .table-with-page-page {
        box-shadow: 0 -4px 5px 0 #F7F8FA;
        padding: 16px 20px;
        position: relative;
        z-index: 1;
      }
      /deep/ .table-with-page-table {
        &, .boo-table {
          overflow-y: auto;
        }
        border: none;
        flex: 1;
        margin: 20px 20px 0 20px;
      }
      /deep/ .boo-table {
        &::after {
          display: none;
        }
        th {
          border-top: 1px solid #e8eaec;
        }
        .boo-table-cell {
          padding: 14px 24px;
        }
        .boo-table-header {
          color: @text-tip-color;
          line-height: 22px;
          th {
            font-weight: normal;
          }
        }
      }
    }
    &-search {
      margin-right: 16px;
      width: 240px;
    }
    &-clear {
      font-size: @font-size-base;
    }
  }
</style>
