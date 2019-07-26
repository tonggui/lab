<template>
  <SortTagList
    v-if="sorting"
    :tagList="tagList"
    v-bind="propsData"
    v-on="listeners"
    @toggle-smart-sort="handleToggleSmartSort"
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
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import SortTagList from '@/views/components/sort-tag-list' // 分类排序
  import {
    defaultTagId
  } from '@/data/constants/poi'

  export default {
    name: 'tag-list-container',
    props: {
      labelInValue: Boolean, // 返回整个item还是返回id
      sorting: Boolean, // 是否在排序状态中
      smartSortSwitch: Boolean, // 是否开启智能排序
      showSmartSort: Boolean, // 是否展示智能排序
      topLimit: Number, // 智能排序，允许的置顶数
      productCount: Number, // 门店总商品数
      tagList: Array, // 分类列表
      tagId: { // 当前选中的tagId
        type: Number,
        default: defaultTagId
      },
      loading: Boolean // 加载中...
    },
    data () {
      return {
        expandList: [] // tag 树展开的id list
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
      // 需要透传递的参数
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
      // 需要绑定的事件集合
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
      },
      handleToggleSmartSort (v) {
        this.$emit('toggle-smart-sort', v)
      }
    }
  }
</script>
