<template>
  <Drawer
    :closable="false"
    :value="visible"
    :mask-closable="false"
    :width="870"
    class-name="category-template-drawer"
    :styles="styles"
    class="category-template-drawer-container"
  >
    <div class="container">
      <template v-if="visible">
        <CategoryTemplateSelect v-if="showTemplate" />
        <CategoryTemplatePreview v-if="showPreview" />
      </template>
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
      ...mapGetters(['visible', 'showTemplate', 'showPreview']),
      styles () {
        return { padding: 0 }
      }
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
    // /deep/ .category-template-drawer {
    //   z-index: 2000; // TODO z-index 不准
    // }
  }
  .container {
    height: 100%;
  }
</style>
