<template>
  <div>
    <h1>{{ test1 }}</h1>
    <ProductListPage>
      <ListHeader slot="header" />
      <template v-if="sorting">
        <SortTagList slot="tag-list" @select="handleTagChange" />
        <SortProductList slot="product-list" />
        <StickyFooter class="footer" slot="footer" :gap="0" :btnTexts="['完成']" :btnTypes="['primary']" @on-click="handleCloseSort" />
      </template>
      <template v-else>
        <ManageTagList slot="tag-list" @open-sort="handleOpenSort" @select="handleTagChange" />
        <ProductTableList slot="product-list" />
        <FooterEvaluate class="footer" slot="footer" :pageType="6" title="新版商品管理对您是否有帮助" />
      </template>
    </ProductListPage>
  </div>
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
  import { mapModule } from '@/common/module-manage'

  const { mapGetters, mapActions } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list-page',
    computed: {
      ...mapGetters(['sorting']),
      ...mapModule({
        test1: 'test'
      })
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
      }),
      handleOpenSort () {
        this.setSorting(true)
      },
      handleCloseSort () {
        this.setSorting(false)
      }
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
