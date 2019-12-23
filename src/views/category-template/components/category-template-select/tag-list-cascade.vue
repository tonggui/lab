<template>
  <div class="tag-list-cascade">
    <div class="tag-list-cascade-header">
      <span v-for="(count, index) in tagCount" :key="index">
        {{ chineseIndex(index + 1) }}级分类共 {{ count }} 个
      </span>
    </div>
    <MultiCascadeLocal
      v-bind="$attrs"
      :data-source="tagList"
      :checkable="editable"
      :value="value"
      :default-select-all="defaultSelectAll"
      class="tag-list-cascade-content"
      menu-class="tag-list-cascade-menu"
      @change="$emit('change', $event)"
    />
    <div class="tag-list-cascade-footer">
      <div v-if="editable">{{ selectDescription }}</div>
    </div>
  </div>
</template>
<script>
  import MultiCascadeLocal from '@components/multi-cascade/multi-cascade-local'

  export default {
    name: 'tag-list-cascade',
    props: {
      tagList: {
        type: Array,
        default: () => []
      },
      editable: Boolean,
      value: {
        type: Array,
        default: () => []
      },
      defaultSelectAll: Boolean
    },
    computed: {
      tagCount () {
        const result = []
        this.traverse(this.tagList, result, 0)
        return result
      },
      selectDescription () {
        const total = this.value.length
        const firstLevelCount = this.tagList.reduce((prev, item) => {
          if (this.value.includes(item.id)) {
            prev += 1
          }
          return prev
        }, 0)
        const secondLevelCount = total - firstLevelCount
        return `已选一级${firstLevelCount}个，二级${secondLevelCount}个`
      }
    },
    components: {
      MultiCascadeLocal
    },
    methods: {
      traverse (list, countList, level = 0) {
        countList[level] = (countList[level] || 0) + list.length
        list.forEach((item) => {
          if (item.children && item.children.length > 0) {
            this.traverse(item.children, countList, level + 1)
          }
        })
        return countList
      },
      chineseIndex (index) {
        const map = ['', '一', '二', '三', '四']
        return map[index] || ''
      }
    }
  }
</script>
<style lang="less" scoped>
  .tag-list-cascade {
    height: 100%;
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      background: #F4F4F4;
      height: 30px;
      line-height: 30px;
      > span {
        flex: 1;
        padding: 0 10px;
        color: #91949E;
      }
    }
    &-content {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
    }
    /deep/ .tag-list-cascade-menu {
      height: 100%;
      width: 154px;
      &:first-child {
        min-width: 168px;
      }
    }
    &-footer {
      font-size: @font-size-small;
      color: #A2A4B3;
      line-height: 18px;
      margin: 10px 0;
    }
  }
</style>
