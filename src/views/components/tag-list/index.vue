<template>
  <SortTagList
    v-if="sorting"
    :tagList="tagList"
    v-bind="propsData"
    @change="$listeners.sort"
    @toggle-smart-sort="handleToggleSmartSort"
    @select="$listeners.select"
    @expand="handleTagExpand"
  />
  <ManageTagList
    v-else
    :tagList="tagList"
    :show-sort="showSort"
    :productCount="productCount"
    @change-level="$listeners['change-level-tag']"
    @open-sort="$listeners['open-sort']"
    @delete="$listeners['delete-tag']"
    @edit="$listeners['edit-tag']"
    @add="$listeners['add-tag']"
    @select="$listeners.select"
    @expand="handleTagExpand"
    v-bind="propsData"
  />
</template>
<script>
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import SortTagList from '@/views/components/sort-tag-list' // 分类排序

  export default {
    name: 'product-tag-list',
    props: {
      labelInValue: Boolean, // 返回整个item还是返回id
      sorting: Boolean, // 是否在排序状态中
      smartSortSwitch: Boolean, // 是否开启智能排序
      showSmartSort: Boolean, // 是否展示智能排序
      topLimit: Number, // 智能排序，允许的置顶数
      productCount: Number, // 门店总商品数
      tagList: Array, // 分类列表
      tagId: Number,
      loading: Boolean, // 加载中...
      showSort: Boolean
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
      // 需要透传递的参数
      propsData () {
        return {
          ...this.$attrs,
          labelInValue: this.labelInValue,
          expandList: this.expandList,
          tagId: this.tagId,
          loading: this.loading,
          smartSortSwitch: this.smartSortSwitch,
          showSmartSort: this.showSmartSort
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
