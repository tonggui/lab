<template>
  <SortTagList
    v-if="sorting"
    :tagList="sortTagList"
    v-bind="propsData"
    v-on="listeners"
    @toggle-smart-sort="$listeners['toggle-smart-sort']"
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
import ManageTagList from './components/manage-tag-list'
import SortTagList from './components/sort-tag-list'
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
        this.$emit('select', node.id)
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
<style lang="less" scoped>
.tag-list {
  &-header {
    display: flex;
    padding: 15px 20px;
    button {
      height: 30px;
      line-height: 1;
      padding: 8px 10px;
      font-size: @font-size-small;
      &:not(:last-child) {
        margin-right: 10px;
      }
      i {
        margin-top: -3px;
      }
    }
  }
}
</style>
