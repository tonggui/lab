<template>
  <ProductListPage>
    <div slot="header">
      <RecommendBreadcrumb />
    </div>
    <div slot="content" class="product-recommend-container">
      <AlertTip :title="title" :desc="desc" class="alert" />
      <ProductListWithHeader />
    </div>
  </ProductListPage>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductListWithHeader from './container/product-list-with-header'
  import AlertTip from './components/alert-tip'
  import RecommendBreadcrumb from './components/breadcrumb'

  export default {
    name: 'product-recommend',
    data () {
      return {
        title: '店内暂无商品',
        desc: '同城高销量商家告诉你：店内有库存商品大于 300 个会带来更多收入哦～'
      }
    },
    components: {
      ProductListPage,
      ProductListWithHeader,
      AlertTip,
      RecommendBreadcrumb
    },
    methods: {
      getData () {
        // to-do
      }
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
