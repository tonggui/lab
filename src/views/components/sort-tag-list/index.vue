<template>
  <Layout :loading="loading">
    <template slot="header">
      <div class="sort-tag-list-header" v-if="showSmartSort">
        <span>分类智能排序</span>
        <iSwitch size="small" :value="smartSortSwitch" @on-change="handleToggleSmartSwitch" />
      </div>
    </template>
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
  import Layout from '@/views/components/layout/tag-list'
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
    },
    methods: {
      handleToggleSmartSwitch (value) {
        this.$emit('toggle-smart-sort', value)
      }
    }
  }
</script>
<style lang="less">
.sort-tag-list-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid @border-color-light;
  span {
    margin-right: 5px;
  }
}
</style>
