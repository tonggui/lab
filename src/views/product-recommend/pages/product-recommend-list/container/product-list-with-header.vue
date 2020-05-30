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
          <ProductSearch @on-search="handleSearch" />
          <SelectedProductButtonOperations :total="totalSelectedCount" @on-click-view="drawerVisible = true" @on-click-create="handleClickCreate" />
        </div>
      </Header>
      <TagList slot="tag-list" @on-select="handleChangeTag" />
      <ProductTableList slot="product-list" @on-select="handleSelectProduct" @on-de-select="handleDeSelectProduct" :maxSelect="maxSelect" :selectedIdList="selectedIdList" />
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" :total="totalSelectedCount" @on-click-create="handleClickCreate" />
    <DeleteProductsModal v-model="deleteVisible" :dataSource="dataSource" :isAllDeleted="false" @on-click-reselect="deleteVisible = false" />
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import SelectedProductButtonOperations from '../components/selected-product-button-operations'
  import DeleteProductsModal from '../../../components/delete-products-modal'
  import { fetchCheckProducts } from '@/data/repos/product'
  import TagList from './tag-list'
  import ProductTableList from './product-list'
  import ProductSelectedDrawer from './product-selected-drawer'
  import { helper } from '@/views/product-recommend/store'
  import { objToArray } from '../../../utils'

  const { mapActions } = helper('recommendList')

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
      DeleteProductsModal
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
            if (!res.deleteSpuList.length) {
              this.$router.push({ path: '/product/recommend/edit', query: this.$route.query })
            } else {
              this.dataSource = res.deleteSpuList
              this.deleteVisible = true
              this.$emit('on-de-select', res.deleteSpuList)
              this.getData()
            }
          }).catch(err => {
            this.$Message(err.message || err)
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
