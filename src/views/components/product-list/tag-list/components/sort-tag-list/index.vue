<template>
  <Layout
    :loading="loading"
    :smartSortSwitch="smartSortSwitch"
    :showSmartSort="showSmartSort"
    @change="$listeners['toggle-smart-sort']"
  >
    <template slot="content">
      <component
        v-bind="$attrs"
        v-on="$listeners"
        :is="component"
      ></component>
    </template>
  </Layout>
</template>
<script>
import Layout from '@/views/components/product-list/layout/sort'
import SmartSortTagList from './smart-sort-tag-list'
import DragSortTagList from './drag-sort-tag-list'

export default {
  name: 'sort-tag-list',
  props: {
    loading: Boolean,
    showSmartSort: Boolean,
    smartSortSwitch: Boolean
  },
  components: {
    Layout,
    SmartSortTagList,
    DragSortTagList
  },
  computed: {
    component () {
      return this.smartSortSwitch ? SmartSortTagList : DragSortTagList
    }
  }
}
</script>
