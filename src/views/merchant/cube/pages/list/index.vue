<template>
  <div class="cube-container">
    <ErrorBoundary
      type="loading"
      :error="pageError"
      @refresh="handleRefresh"
    >
      <ProductListFixedPage class="product-recommend-container-product">
        <div slot="header">
          <AlertTip :title="title" :desc="desc" class="alert" v-if="!error" />
        </div>
        <div slot="content" class="product-recommend-container-product-content">
          <ProductListWithHeader
            :selectedIdList="selectedIdList"
            :classifySelectedProducts="classifySelectedProducts"
            @on-select="handleSelect"
            @on-de-select="handleDeSelect"
            @set-edit-product="handleSetEditProduct"
            class="recommend-table-list"
          />
        </div>
      </ProductListFixedPage>
    </ErrorBoundary>
  </div>
</template>

<script>
  import ProductListFixedPage from '@/views/components/layout/product-list-fixed-page'
  import ProductListWithHeader from './container/product-list-with-header'
  import AlertTip from './components/alert-tip'
  import { fetchUploadRecTips } from '@/data/repos/product'

  import { helper } from '../../../../product-recommend/store'

  const { mapState, mapActions } = helper()

  export default {
    name: 'cube',
    data () {
      return {
        title: '店内暂无商品',
        desc: '',
        error: false
      }
    },
    computed: {
      ...mapState({
        classifySelectedProducts: 'classifySelectedProducts',
        tagListError: state => state.recommendList.tagList.error,
        productListError: state => state.recommendList.productList.error
      }),
      pageError () {
        console.log('this.tagListError', this.tagListError)
        return this.error && this.tagListError && this.productListError
      },
      selectedIdList () {
        return Object.values(this.classifySelectedProducts).reduce((prev, { productList }) => {
          productList.forEach(({ __id__ }) => prev.push(__id__))
          return prev
        }, [])
      }
    },
    components: {
      ProductListFixedPage,
      ProductListWithHeader,
      AlertTip
    },
    methods: {
      ...mapActions({
        handleDestroyStatus: 'destroyStatus',
        handleSelect: 'selectProduct',
        handleDeSelect: 'deSelectProduct',
        handleSetEditProduct: 'setEditProductList',
        handleGetData: 'recommendList/getData'
      }),
      handleRefresh () {
        this.getUploadRecTips()
        this.handleGetData()
      },
      handleGoBack () {
        this.handleDestroyStatus()
        this.$router.push({ name: 'productList', query: this.$route.query })
      },
      getUploadRecTips () {
        fetchUploadRecTips().then(res => {
          this.error = false
          const { title, content } = res
          this.title = title
          this.desc = content
        }).catch(err => {
          this.error = true
          this.$Message.error(err.message || err)
        })
      }
    },
    mounted () {
      this.getUploadRecTips()
    }
  }
</script>
<style lang="less">
.product-recommend-container-product .product-list-fixed-page-layout-content {
  height: calc(100% - 94px);
}
</style>
<style lang="less" scoped>
.cube-container {
  height: 100%;
  overflow: hidden;
  /deep/ .container {
    height: calc(100% - 14px);
  }
  &-product {
    margin-bottom: 0;
    overflow: hidden;
    height: 100%;
    /deep/ .boo-alert-with-desc {
      margin-bottom: 0;
    }
    .alert {
      margin-top: 16px;
    }
    &-content {
      width: 100%;
      height: 100%;
      background: #F7F8FA;
      .recommend-table-list {
        height: calc(100% - 8px);
        margin-top: 8px;
      }
    }
  }
}
</style>
