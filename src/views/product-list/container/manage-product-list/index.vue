<template>
  <div>
    <Alert type="error" v-if="categoryTemplateTaskApplying" show-icon>店内分类生成中，请勿调整当前店内分类信息</Alert>
    <ProductListPage>
      <ManageTagList
        slot="tag-list"
        @open-sort="$emit('open-sort')"
        @select="handleTagChange"
        @show-category-template="handleShowCategoryTemplate"
        :support-category-template="supportCategoryTemplate"
      />
      <ProductTableList :tag-list="tagList" slot="product-list" :is-new-poi-recommend="isNewPoiRecommend">
        <Alert slot="tips" type="info" show-icon closable v-if="currentTag.isUnCategorized">
          可直接将使用“批量改分类”移动商品至其他分类
        </Alert>
      </ProductTableList>
      <FooterEvaluate v-if="isBusinessClient" class="footer" slot="footer" :pageType="6" title="新版商品管理对您是否有帮助" />
    </ProductListPage>
    <CategoryTemplate :guide="showCategoryTemplateGuideModal" />
    <BackTop />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import FooterEvaluate from '@components/footer-evaluate'
  import ManageTagList from './manage-tag-list'
  import ProductTableList from './product-table-list'
  import CategoryTemplate from './category-template'

  const { mapActions, mapGetters } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list',
    props: {
      isBusinessClient: Boolean
    },
    computed: {
      ...mapGetters({
        currentTag: 'currentTag',
        tagList: 'tagList',
        isNewPoiRecommend: 'isNewPoiRecommend',
        categoryTemplateTaskApplying: 'categoryTemplateTaskApplying',
        showCategoryTemplateGuideModal: 'showCategoryTemplateGuideModal',
        supportCategoryTemplate: 'supportCategoryTemplate'
      })
    },
    components: {
      ProductListPage,
      ManageTagList,
      ProductTableList,
      FooterEvaluate,
      CategoryTemplate
    },
    methods: {
      ...mapActions({
        handleTagChange: 'changeTag',
        handleShowCategoryTemplate: 'showCategoryTemplate'
      })
    }
  }
</script>
<style lang="less" scoped>
.footer {
  margin-top: 10px;
}
</style>
