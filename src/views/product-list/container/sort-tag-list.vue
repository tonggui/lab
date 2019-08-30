<template>
  <SortTagList
    labelInValue
    showSmartSort
    :loading="loading"
    :smartSortSwitch="smartSortSwitch"
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

  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('productList/tagList')

  export default {
    name: 'product-sort-tag-list-container',
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
      // TODO callback 关闭弹框
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
