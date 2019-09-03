<template>
  <ProductListPage>
    <ListHeader slot="header" :is-new-poi-recommend="isNewPoiRecommend" />
    <template v-if="sorting">
      <SortTagList slot="tag-list" @select="handleTagChange" />
      <SortProductList slot="product-list" />
      <StickyFooter class="footer" slot="footer" @on-click="setSorting(false)" :gap="0" :btnTexts="['完成']" :btnTypes="['primary']" />
    </template>
    <template v-else>
      <ManageTagList slot="tag-list" @open-sort="setSorting(true)" @select="handleTagChange" />
      <ProductTableList slot="product-list" :is-new-poi-recommend="isNewPoiRecommend" />
      <FooterEvaluate class="footer" slot="footer" :pageType="6" title="新版商品管理对您是否有帮助" />
    </template>
  </ProductListPage>
</template>
<script>
  // TODO sorting 转场动画
  import { createNamespacedHelpers } from 'vuex'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ListHeader from './components/list-header'
  import SortTagList from './container/sort-tag-list'
  import ManageTagList from './container/manage-tag-list'
  import ProductTableList from './container/product-table-list'
  import SortProductList from './container/sort-product-list'
  import StickyFooter from '@components/sticky-footer'
  import FooterEvaluate from '@components/footer-evaluate'
  import {
    POI_HOT_RECOMMEND
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  const { mapActions, mapGetters } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list-page',
    mixins: [
      withModules({
        hotRecommend: POI_HOT_RECOMMEND
      })
    ],
    computed: {
      ...mapGetters(['sorting', 'totalProductCount', 'loading']),
      isNewPoiRecommend () {
        return !this.loading && this.hotRecommend && this.totalProductCount <= 5
      }
    },
    components: {
      ProductListPage,
      ListHeader,
      SortTagList,
      ManageTagList,
      ProductTableList,
      SortProductList,
      StickyFooter,
      FooterEvaluate
    },
    methods: {
      ...mapActions(['setSorting', 'getData']),
      ...mapActions({
        handleTagChange: 'changeTag'
      })
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less" scoped>
  .footer {
    margin-top: 10px;
    /deep/ .sticky {
      z-index: 10;
    }
  }
</style>
