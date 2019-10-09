<template>
  <CategoryTemplatePreview
    :template-type="templateType"
    :tag-list="previewTagList"
    :fetchProduct="fetchProduct"
    @cancel="handleBackTemplate"
    @submit="handleSubmit"
  />
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import CategoryTemplatePreview from '@/views/product-list/components/category-template-preview'

  const { mapActions, mapGetters, mapState } = createNamespacedHelpers('productList/template')

  export default {
    name: 'category-template-preview-container',
    computed: {
      ...mapState(['selectedIndex', 'templateList']),
      ...mapGetters(['previewTagList']),
      templateType () {
        const template = this.templateList[this.selectedIndex]
        return template && template.type
      }
    },
    components: {
      CategoryTemplatePreview
    },
    methods: {
      ...mapActions({
        handleApply: 'apply',
        handleBackTemplate: 'backTemplate',
        fetchProduct: 'fetchPreviewProduct'
      }),
      async handleSubmit (callback) {
        await this.handleApply()
        callback()
      }
    }
  }
</script>
