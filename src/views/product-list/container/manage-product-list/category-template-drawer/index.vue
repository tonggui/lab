<template>
  <Drawer
    :closable="false"
    :value="visible"
    :mask-closable="false"
    :width="630"
    class-name="category-template-drawer"
    class="category-template-drawer-container"
  >
    <div class="container">
      <CategoryTemplateSelect v-if="showTemplate" />
      <CategoryTemplatePreview v-if="showPreview" />
    </div>
  </Drawer>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import CategoryTemplateSelect from './category-template-select'
  import CategoryTemplatePreview from './category-template-preview'

  const { mapGetters } = createNamespacedHelpers('productList/template')

  export default {
    name: 'category-template-drawer-container',
    computed: {
      ...mapGetters(['visible', 'showTemplate', 'showPreview'])
    },
    components: {
      CategoryTemplateSelect,
      CategoryTemplatePreview
    }
  }
</script>
<style lang="less" scoped>
  .category-template-drawer-container {
    /deep/ .drawer-content {
      padding: 0;
    }
  }
  .container {
    height: 100%;
  }
</style>
