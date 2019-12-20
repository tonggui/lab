<template>
  <Drawer
    closable
    :value="visible"
    :mask-closable="false"
    :width="680"
    class-name="category-template-drawer"
    class="category-template-drawer-container"
    @on-close="handleClose"
  >
    <div slot="close" @click="handleClose"><Icon type="closed" size="14" /></div>
    <div class="container">
      <keep-alive>
        <CategoryTemplateSelect v-if="showTemplate" />
      </keep-alive>
      <CategoryTemplatePreview v-if="showPreview" />
    </div>
  </Drawer>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import CategoryTemplateSelect from './category-template-select'
  import CategoryTemplatePreview from './category-template-preview'

  const { mapGetters, mapActions } = createNamespacedHelpers('categoryTemplate')

  export default {
    name: 'category-template-drawer-container',
    computed: {
      ...mapGetters(['visible', 'showTemplate', 'showPreview'])
    },
    components: {
      CategoryTemplateSelect,
      CategoryTemplatePreview
    },
    methods: {
      ...mapActions({
        handleClose: 'hide'
      })
    }
  }
</script>
<style lang="less" scoped>
  .category-template-drawer-container {
    /deep/ .drawer-content {
      padding: 0;
    }
    /deep/ .boo-drawer-close {
      color: @text-color;
      top: 20px;
      right: 20px;
    }
  }
  .container {
    height: 100%;
  }
</style>
