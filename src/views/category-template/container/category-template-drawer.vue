<template>
  <Drawer
    closable
    :value="visible"
    :mask-closable="false"
    :width="680"
    class-name="category-template-drawer"
    class="category-template-drawer-container"
  >
    <div slot="close" @click="handleClose">
      <Icon type="closed" size="14" />
    </div>
    <div class="container">
      <keep-alive>
        <CategoryTemplateSelect v-if="showTemplate" />
        <CategoryTemplatePreview v-if="showPreview" />
      </keep-alive>
    </div>
  </Drawer>
</template>
<script>
  import lx from '@/common/lx/lxReport'
  import { createNamespacedHelpers } from 'vuex'
  import CategoryTemplateSelect from './category-template-select'
  import CategoryTemplatePreview from './category-template-preview'

  const { mapGetters, mapActions } = createNamespacedHelpers('categoryTemplate')

  export default {
    name: 'category-template-drawer-container',
    computed: {
      ...mapGetters(['visible', 'showTemplate', 'showPreview', 'currentTemplate'])
    },
    components: {
      CategoryTemplateSelect,
      CategoryTemplatePreview
    },
    methods: {
      ...mapActions(['hide']),
      handleClose () {
        const templateId = this.currentTemplate ? this.currentTemplate.detail.id : ''
        lx.mc({ bid: 'b_shangou_online_e_yefykiao_mc', val: { template_cat_id: templateId } })
        this.hide()
      }
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
