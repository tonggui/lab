<template>
  <div>
    <BreadcrumbHeader>待收录商品</BreadcrumbHeader>
    <ProductListPage>
      <div class="header" slot="header">
        <div>
          <h4>待收录商品</h4>
          <small>分店新增商品，会临时放在待收录，您可收录到总部商品库中</small>
        </div>
        <div class="header-right-wrapper">
          <span>自动收录</span>
          <Tooltip type="help" placement="bottom-end" :width="200" :offset="14" content="关联门店数≥2的商品，自动收录到总部商品库；总部操作删除商品时，选择的“删除总部商品”，不会自动收录">
            <iSwitch class="auto-switch" :value="autoApprove" @on-change="handleAutoApprove" />
          </Tooltip>
          <ProductSearch class="search-wrapper" @search="handleSearch" />
        </div>
      </div>
      <TagList slot="tag-list" />
      <ProductList slot="product-list" />
    </ProductListPage>
  </div>
</template>
<script>
  import { helper } from './store'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import TagList from './container/tag-list'
  import ProductList from './container/product-list'
  import ProductSearch from '@/views/merchant/components/product-search'

  const { mapActions, mapState } = helper()

  export default {
    name: 'merchant-approve-list',
    computed: {
      ...mapState(['autoApprove'])
    },
    components: {
      BreadcrumbHeader,
      ProductListPage,
      TagList,
      ProductList,
      ProductSearch
    },
    methods: {
      ...mapActions({
        getData: 'getData',
        destroy: 'destroy',
        handleAutoApprove: 'setAutoApprove',
        handleKeywordSearch: 'keywordSearch'
      }),
      handleSearch (item) {
        console.log('item', item)
        this.handleKeywordSearch(item.name)
      }
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
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
  &-right-wrapper {
    display: inline-flex;
    align-items: center;
    .search-wrapper {
      margin-left: 12px;
      margin-right: 0;
    }
  }
}
</style>
<style lang="less">
.approve-list-table-time-cell {
  padding-left: 40px;
}
</style>
