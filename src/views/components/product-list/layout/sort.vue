<template>
  <Layout>
    <div class="sort-header" slot="header">
      <template v-if="showSmartSort">
        <span>分类智能排序</span>
        <iSwitch size="small" :value="smartSortSwitch" @on-change="$listeners.change" />
      </template>
      <span v-else>商品/分类排序</span>
    </div>
    <template slot="content">
      <slot name="content"></slot>
    </template>
  </Layout>
</template>

<script>
  import Layout from '@/views/components/product-list/layout/tag-list'

  export default {
    name: 'product-sort-layout',
    props: {
      smartSortSwitch: Boolean,
      showSmartSort: Boolean
    },
    components: {
      Layout
    }
  }
</script>
<style lang="less" scoped>
.sort-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid @border-color-light;
  span {
    margin-right: 5px;
  }
}
</style>
