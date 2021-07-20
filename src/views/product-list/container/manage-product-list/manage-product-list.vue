<template>
  <div class="manage-product-list">
    <Alert v-if="categoryTemplateApplying" type="warning" show-icon class="tips">
      分类模版正在提交中，当前店内分类信息暂不支持调整，约需要等待10秒，请稍侯...
    </Alert>
    <div class="product-list-header">
      商品列表
    </div>
    <ProductListPage>
      <ManageTagList
        slot="tag-list"
        :disabled="disabled || categoryTemplateApplying"
        @open-sort="$emit('open-sort')"
        @show-category-template="handleShowCategoryTemplate"
      />
      <ProductTableList
        slot="product-list"
        :disabled="disabled"
        :tag-list="tagList"
      >
        <Alert slot="tips" type="warning" show-icon closable v-if="currentTag.isUnCategorized">
          可直接将使用“批量改分类”移动商品至其他分类
        </Alert>
      </ProductTableList>
      <FooterEvaluate
        v-if="isBusinessClient"
        slot="footer"
        class="footer"
        :pageType="6"
        title="新版商品管理对您是否有帮助"
      />
    </ProductListPage>
    <BackTop />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import FooterEvaluate from '@components/footer-evaluate'
  import ManageTagList from './manage-tag-list'
  import ProductTableList from './product-table-list'

  const { mapGetters } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list',
    props: {
      isBusinessClient: Boolean,
      disabled: Boolean,
      categoryTemplateApplying: Boolean
    },
    computed: {
      ...mapGetters({
        currentTag: 'currentTag',
        tagList: 'tagList'
      })
    },
    components: {
      ProductListPage,
      ManageTagList,
      ProductTableList,
      FooterEvaluate
    },
    methods: {
      handleShowCategoryTemplate () {
        this.$emit('show-category-template')
      }
    }
  }
</script>
<style lang="less" scoped>
  .manage-product-list {
    .tips {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 10px;
    }
    .product-list-header {
      width: 100%;
      height: 54px;
      line-height: 60px;
      background: #fff;
      font-weight: 500;
      font-size: 18px;
      color: #000000;
      border-bottom: 1px solid #EEEEEE;
      padding-left: 24px;
    }
  }
</style>
