<template>
  <div class="container">
    <div v-for="item in dataSource" :key="item.id">
      <MenuItem :item="item" :actived="isActived(item)" :opened="isOpened(item)"></MenuItem>
      <template v-if="!item.isLeaf">
        <div v-show="isOpened(item)">
          <category-tree :dataSource="item.children" :value="value" :expandIdList="expandIdList"></category-tree>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { findFirstLeaf } from '@/common/utils'
import MenuItem from './menu-item'

export default {
  name: 'category-tree',
  props: {
    // 数据源
    dataSource: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    // 当前选中的id
    value: {
      type: [Number, String]
    },
    // 当前展开的id
    expandIdList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 是否默认选择第一项
    defaultSelectFirst: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    activeId () {
      if (this.value === undefined && this.defaultSelectFirst) {
        const leafNode = findFirstLeaf(this.dataSource)
        return leafNode.id
      }
      return this.value
    }
  },
  methods: {
    isActived (item) {
      return item.isLeaf && item.id === this.activeId
    },
    isOpened (item) {
      return !item.isLeaf && this.expandIdList.includes(item.id)
    }
  },
  components: {
    MenuItem
  }
}
</script>
<style lang="less" scoped>
  .container {
    display: inline-block;
    width: 240px;
    background: #ffffff;
  }
</style>
