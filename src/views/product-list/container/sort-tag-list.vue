<template>
  <SortTagList
    labelInValue
    :show-smart-sort="showSmartSort"
    :loading="loading"
    :smart-sort-switch="smartSortSwitch"
    :tag-list="tagList"
    :expand-list="expandList"
    :tag-id="tagId"
    @change="handleSort"
    @toggle-smart-sort="handleToggleSmartSort"
    @select="handleSelect"
    @expand="handleExpand"
  />
</template>
<script>
  import SortTagList from '@/views/components/sort-tag-list' // 分类排序
  import { createNamespacedHelpers } from 'vuex'
  import {
    SWITCH_TAG_SMART_SORT
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('productList/tagList')

  export default {
    name: 'product-sort-tag-list-container',
    mixins: [withModules({ showSmartSort: SWITCH_TAG_SMART_SORT })],
    computed: {
      ...mapState(['expandList', 'loading']),
      ...mapGetters({
        tagId: 'currentTagId',
        smartSortSwitch: 'isSmartSort',
        tagList: 'list'
      })
    },
    components: {
      SortTagList
    },
    methods: {
      ...mapActions({
        handleToggleSmartSort: 'toggleSmartSort',
        handleExpand: 'expand',
        sort: 'sort'
      }),
      handleSelect (tag) {
        this.$emit('select', tag)
      },
      handleSort (tagList, tag, sortList) {
        this.sort({ tagList, tag, sortList })
      }
    }
  }
</script>
