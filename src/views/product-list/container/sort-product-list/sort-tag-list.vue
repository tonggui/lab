<template>
  <SortTagList
    labelInValue
    :show-smart-sort="showSmartSort"
    :loading="loading"
    :smart-sort-switch="smartSortSwitch"
    :tag-list="tagList"
    :expand-list="expandList"
    :tag-id="tagId"
    :tag-top-limit="tagTopLimit"
    @change="handleSort"
    @toggle-smart-sort="handleToggleSmartSort"
    @select="handleSelect"
    @expand="handleExpand"
    need-permission
  />
</template>
<script>
  import SortTagList from '@/views/components/sort-tag-list' // 分类排序
  import { createNamespacedHelpers } from 'vuex'
  import {
    TAG_SMART_SORT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('productList/tagList')

  export default {
    name: 'product-sort-tag-list-container',
    computed: {
      ...mapModule({
        showSmartSort: TAG_SMART_SORT
      }),
      ...mapState(['expandList', 'loading']),
      ...mapGetters({
        tagId: 'currentTagId',
        smartSortSwitch: 'isSmartSort',
        tagList: 'list',
        tagTopLimit: 'topLimit'
      })
    },
    components: {
      SortTagList: withPromiseEmit(SortTagList)
    },
    methods: {
      ...mapActions({
        handleToggleSmartSort: 'toggleSmartSort',
        handleExpand: 'expand',
        handleSelect: 'select',
        sort: 'sort'
      }),
      handleSort (tagList, tag, sortList) {
        return this.sort({ tagList, tag, sortList })
      }
    }
  }
</script>
