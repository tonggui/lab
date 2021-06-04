<template>
  <div>
    <ProductListPage class="product-list-container">
      <Header slot="header">
        <div slot="left" class="header-left">
          <CubeLogo />新店必建商品<a class="teacher" href="https://daxue.meituan.com/m/shangoushang/video/568" target="_blank">教你如何建品?</a>
        </div>
        <div slot="right" class="header-right">
          <ProductSearch @on-search="handleSearch" :searchValue="keyword" />
          <SelectedProductButtonOperations :total="totalSelectedCount" @on-click-view="drawerVisible = true" @on-click-create="handleClickCreate" />
        </div>
      </Header>
      <ErrorPage slot="content" @on-retry="getData" v-if="!loading && listError" />
      <EmptyPage slot="content" v-else-if="!loading && !listError && !list.length" desc="暂无搜索结果" tip="可更换搜索词试试～" />
      <template>
        <TagList slot="tag-list" @on-select="handleChangeTag" class="content-tag" />
        <ProductTableList slot="product-list" @on-select="handleSelectProduct" @on-de-select="handleDeSelectProduct" :maxSelect="maxSelect" :selectedIdList="selectedIdList" />
      </template>
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" :total="totalSelectedCount" @on-click-create="handleClickCreate" />
    <DeleteProductsModal v-model="deleteVisible" :dataSource="deletedProductList" :isAllDeleted="isAllDeleted" @on-click-reselect="deleteVisible = false" @on-click-create="handleGoToRecommendEdit" />
  </div>
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
  import CubeLogo from '@/views/components/cube-logo/index'

  const MAX_SELECT = 100 // 最大可选数量

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
        maxSelect: MAX_SELECT,
        deleteVisible: false,
        deletedProductList: [],
        editProductList: [],
        isAllDeleted: false
      }
    },
    computed: {
      ...mapState({
        loading: state => state.tagList.loading,
        list: state => state.tagList.list,
        listError: state => state.tagList.error,
        keyword: state => state.productList.filters.keyword
      }),
      totalSelectedCount () {
        return this.selectedIdList.length
      }
    },
    components: {
      CubeLogo,
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
        handleChangeTag: 'changeTag',
        destroy: 'destroy'
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
      handleGoToRecommendEdit () {
        this.$emit('set-edit-product', this.editProductList)
        this.$router.push({ name: 'recommendEdit', query: this.$route.query })
      },
      handleClickCreate (callback) {
        if (this.drawerVisible) this.drawerVisible = false
        fetchCheckProducts(objToArray(this.classifySelectedProducts))
          .then(res => {
            this.deletedProductList = res.deletedProductList
            this.editProductList = res.editProductList
            if (!res.deletedProductList.length) {
              this.handleGoToRecommendEdit()
            } else {
              this.isAllDeleted = res.deletedProductList.length === this.totalSelectedCount
              this.deleteVisible = true
              this.$emit('on-de-select', res.deletedProductList)
              this.getData()
            }
          }).catch(err => {
            console.error(err)
            this.$Message.error(err.message || err)
          }).finally(() => {
            callback && callback()
          })
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
.product-list-container {
  margin-bottom: 0;
  height: 100%;
  .header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .header-left .teacher {
    line-height: 14px;
    font-size: 14px;
    color: #cccccc;
    font-family: PingFangSC-Regular;
    text-decoration: underline;
    margin-left: 16px;
  }
  .header-right {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
  }
  /deep/ .product-list-page-layout-content {
    min-height: calc(100% - 60px);
  }
  /deep/ .product-list-page-layout-product-list {
    display: flex;
    flex-direction: column;
  }
  .content {
    &-tag {
      overflow: auto;
    }
  }
}
</style>
