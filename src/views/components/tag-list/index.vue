<template>
  <SortTagList
    v-if="sorting"
    :tagList="sortTagList"
    v-bind="propsData"
    v-on="listeners"
    @toggle-smart-sort="(v) => $emit('toggle-smart-sort', v)"
  />
  <ManageTagList
    v-else
    :tagList="tagList"
    :productCount="productCount"
    @open-sort="$listeners['open-sort']"
    @delete="$listeners['delete-tag']"
    @edit="$listeners['edit-tag']"
    @add="$listeners['add-tag']"
    v-bind="propsData"
    v-on="listeners"
  />
</template>
<script>
  import {
    findFirstLeaf
  } from '@/common/utils'
  import ManageTagList from './components/manage-tag-list' // 分类管理
  import SortTagList from './components/sort-tag-list' // 分类排序
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import {
    POI_IS_MEDICINE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  export default {
    name: 'tag-list-container',
    mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
    props: {
      labelInValue: Boolean,
      sorting: Boolean,
      smartSortSwitch: Boolean,
      showSmartSort: Boolean,
      topLimit: Number,
      productCount: Number,
      tagList: Array,
      sortTagList: Array,
      tagId: {
        type: Number,
        default: defaultTagId
      },
      loading: Boolean
    },
    data () {
      return {
        expandList: []
      }
    },
    components: {
      ManageTagList,
      SortTagList
    },
    computed: {
      component () {
        return this.sorting ? SortTagList : ManageTagList
      },
      propsData () {
        return {
          labelInValue: this.labelInValue,
          expandList: this.expandList,
          tagId: this.tagId,
          loading: this.loading,
          smartSortSwitch: this.smartSortSwitch,
          showSmartSort: this.showSmartSort
        }
      },
      listeners () {
        return {
          change: this.$listeners['change-list'],
          select: this.$listeners.select,
          expand: this.handleTagExpand
        }
      }
    },
    watch: {
      sorting (newValue) {
        if (newValue && this.tagId === defaultTagId) {
          const node = findFirstLeaf(this.tagList)
          if (node.level !== 0) {
            this.expandList = [node.parentId, node.id]
          }
          this.$emit('select', this.labelInValue ? node : node.id)
        }
      }
    },
    methods: {
      handleTagExpand (list) {
        this.expandList = list
      }
    }
  }
</script>
