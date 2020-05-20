<template>
  <ErrorBoundary
    :top="200"
    :error="error"
    @refresh="getData"
    description="搜索哪里出了问题～"
  >
    <ProductListPage>
      <Header slot="header">
        <div slot="left">新店必建商品</div>
        <div slot="right" class="header-right">
          <ProductSearch />
          <span class="visible-switch">显示已有商品</span>
        </div>
      </Header>
      <div slot="tag-list">1</div>
      <!-- <div slot="product-list">2</div> -->
      <ProductTableList slot="product-list" />
      <!-- <TagList slot="tag-list" @select="handleChangeTag" /> -->
      <!-- <ProductTableList slot="product-list" :tag-list="poiTagList" /> -->
    </ProductListPage>
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import ProductTableList from '../components/product-table-list/product-table-list'

  export default {
    name: 'product-list-header',
    props: {
      title: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        error: false
      }
    },
    components: {
      ProductListPage,
      Header,
      ProductSearch,
      ProductTableList
    },
    methods: {
      getData () {
      // to-do
      }
    }
  }
</script>

<style lang="less" scoped>
.header-right {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  .visible-switch {
    font-size: 14px;
    color: #676A78;
    line-height: 14px;
    text-decoration: underline;
  }
}
</style>
