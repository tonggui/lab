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
      <ProductTableList slot="product-list" @on-click-view="drawerVisible = true" />
      <TagList slot="tag-list" />
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" />
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import ProductTableList from '../components/product-table-list'
  import ProductSelectedDrawer from './product-selected-drawer'
  import TagList from './tag-list'
  import { helper } from '@/views/product-recommend/store'

  const { mapActions } = helper()

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
        drawerVisible: false,
        error: false
      }
    },
    computed: {
    },
    components: {
      ProductListPage,
      Header,
      ProductSearch,
      ProductTableList,
      TagList,
      ProductSelectedDrawer
    },
    methods: {
      ...mapActions({
        getData: 'getData'
      })
    },
    mounted () {
      try {
        this.getData()
      } catch (err) {
        console.log(err)
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
