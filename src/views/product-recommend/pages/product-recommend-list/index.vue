<template>
  <ProductListPage>
    <div slot="header">
      <RecommendBreadcrumb />
    </div>
    <div slot="content" class="product-recommend-container">
      <AlertTip :title="title" :desc="desc" class="alert" />
      <ProductListWithHeader
        :selectedIdList="selectedIdList"
        :classifySelectedProducts="classifySelectedProducts"
        @on-select="handleSelect"
        @on-de-select="handleDeSelect"
      />
    </div>
  </ProductListPage>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductListWithHeader from './container/product-list-with-header'
  import AlertTip from './components/alert-tip'
  import RecommendBreadcrumb from './components/breadcrumb'
  import { fetchUploadRecTips } from '@/data/repos/product'

  import { helper } from '../../store'

  const { mapState, mapActions } = helper()

  export default {
    name: 'product-recommend',
    data () {
      return {
        title: '',
        desc: ''
      }
    },
    computed: {
      ...mapState(['classifySelectedProducts']),
      selectedIdList () {
        return Object.values(this.classifySelectedProducts).reduce((prev, { productList }) => {
          productList.forEach(({ __id__ }) => prev.push(__id__))
          return prev
        }, [])
      }
    },
    components: {
      ProductListPage,
      ProductListWithHeader,
      AlertTip,
      RecommendBreadcrumb
    },
    methods: {
      ...mapActions({
        handleSelect: 'selectProduct',
        handleDeSelect: 'deSelectProduct'
      }),
      getUploadRecTips () {
        fetchUploadRecTips().then(res => {
          const { title, content } = res
          this.title = title
          this.desc = content
        })
      }
    },
    mounted () {
      this.getUploadRecTips()
    }
  }
</script>

<style lang="less" scoped>
.product-recommend-container {
  width: 100%;
  background: #F7F8FA;
  .alert {
    margin-top: 16px;
  }
}
</style>
