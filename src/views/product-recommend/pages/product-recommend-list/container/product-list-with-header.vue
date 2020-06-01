<template>
  <ErrorBoundary
    :top="200"
    :error="error"
    description="搜索哪里出了问题～"
  >
    <ProductListPage>
      <Header slot="header">
        <div slot="left">新店必建商品</div>
        <div slot="right" class="header-right">
          <ProductSearch @on-search="handleSearch" />
          <SelectedProductButtonOperations :total="totalSelectedCount" @on-click-view="drawerVisible = true" @on-click-create="handleClickCreate" />
        </div>
      </Header>
      <ErrorPage slot="content" @on-retry="getData" v-if="!loading && listError" />
      <EmptyPage slot="content" v-else-if="!loading && !listError && !list.length" />
      <template v-else>
        <TagList slot="tag-list" @on-select="handleChangeTag" />
        <ProductTableList slot="product-list" @on-select="handleSelectProduct" @on-de-select="handleDeSelectProduct" :maxSelect="maxSelect" :selectedIdList="selectedIdList" />
      </template>
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" :total="totalSelectedCount" @on-click-create="handleClickCreate" />
    <DeleteProductsModal v-model="deleteVisible" :dataSource="dataSource" :isAllDeleted="!totalSelectedCount" @on-click-reselect="deleteVisible = false" @on-click-create="$router.push({ path: '/product/recommend/edit', query: $route.query })" />
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import SelectedProductButtonOperations from '../components/selected-product-button-operations'
  import DeleteProductsModal from '../../../components/delete-products-modal'
  import ErrorPage from '../components/error'
  import EmptyPage from '../components/empty'
  import { fetchCheckProducts } from '@/data/repos/product'
  import TagList from './tag-list'
  import ProductTableList from './product-list'
  import ProductSelectedDrawer from './product-selected-drawer'
  import { helper } from '@/views/product-recommend/store'
  import { objToArray } from '../../../utils'

  const { mapActions, mapState } = helper('recommendList')
  export default {
    name: 'product-list-with-header',
    props: {
      selectedIdList: Array,
      classifySelectedProducts: Object
    },
    data () {
      return {
        drawerVisible: false,
        error: false,
        maxSelect: 11,
        deleteVisible: false,
        dataSource: []
      }
    },
    computed: {
      ...mapState({
        loading: state => state.tagList.loading,
        list: state => state.tagList.list,
        listError: state => state.tagList.error
      }),
      totalSelectedCount () {
        return this.selectedIdList.length
      }
    },
    components: {
      ProductListPage,
      Header,
      ProductSearch,
      ProductTableList,
      TagList,
      ProductSelectedDrawer,
      SelectedProductButtonOperations,
      DeleteProductsModal,
      EmptyPage,
      ErrorPage
    },
    methods: {
      ...mapActions({
        getData: 'getData',
        search: 'search',
        handleChangeTag: 'changeTag'
      }),
      handleDeSelectProduct (productList) {
        this.$emit('on-de-select', productList)
      },
      handleSelectProduct (productList) {
        this.$emit('on-select', productList)
      },
      handleSearch (item) {
        this.search({ keyword: item.name })
      },
      handleClickCreate () {
        if (this.drawerVisible) this.drawerVisible = false
        fetchCheckProducts(objToArray(this.classifySelectedProducts))
          .then(res => {
            if (!res.deletedProductList.length) {
              this.$router.push({ path: '/product/recommend/edit', query: this.$route.query })
            } else {
              this.dataSource = res.deletedProductList
              this.deleteVisible = true
              this.$emit('on-de-select', res.deletedProductList)
              this.getData()
            }
          }).catch(err => {
            console.error(err)
            this.$Message.error(err.message || err)
          })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
.header-right {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
}
</style>
