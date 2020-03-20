<template>
  <CategoryTemplatePreview
    :tag-list="tagList"
    :expand-tag-list="expandTagList"
    :product-list="productList"
    :product-pagination="productPagination"
    :product-status-list="productStatusList"
    :product-status="productStatus"
    :product-loading="productLoading"
    :product-error="productError"
    :current-tag-id="currentTagId"
    :current-template="currentTemplate"
    @cancel="handleBackTemplate"
    @submit="handleSubmit"
    @tag-change="handleTagChange"
    @tag-expand="handleTagExpand"
    @product-status-change="handleProductStatusChange"
    @product-pagination-change="handleProductPaginationChange"
  />
</template>
<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import CategoryTemplatePreview from '../components/category-template-preview'

  export default {
    name: 'category-template-preview-container',
    computed: {
      ...mapState('categoryTemplate/preview', {
        tagList: (state) => state.tag.list,
        expandTagList: (state) => state.tag.expandList,
        productList: (state) => state.product.list,
        productPagination: (state) => state.product.pagination,
        productStatusList: (state) => state.product.statusList,
        productStatus: (state) => state.product.status,
        productLoading: (state) => state.product.loading,
        productError: (state) => state.product.error
      }),
      ...mapGetters('categoryTemplate/preview', ['currentTagId']),
      ...mapGetters('categoryTemplate', ['currentTemplate'])
    },
    components: {
      CategoryTemplatePreview
    },
    methods: {
      ...mapActions('categoryTemplate', {
        handleApply: 'apply',
        handleBackTemplate: 'backTemplate'
      }),
      ...mapActions('categoryTemplate/preview', {
        handleTagChange: 'changeCurrentTag',
        handleTagExpand: 'expandTag',
        handleProductStatusChange: 'changeStatus',
        handleProductPaginationChange: 'changePagination'
      }),
      async handleSubmit (callback) {
        try {
          await this.handleApply()
        } catch (err) {
          this.$Message.error(err.message)
        } finally {
          callback && callback()
        }
      }
    }
  }
</script>
