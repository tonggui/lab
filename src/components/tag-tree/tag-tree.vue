<script>
import { findFirstLeaf } from '@/common/utils'
import AutoExpand from '@/transitions/auto-expand'
import MenuItem from './menu-item'

export default {
  name: 'tag-tree',
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
    expandList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 是否默认选择第一项
    defaultSelectFirst: {
      type: Boolean,
      default: false
    },
    labelInValue: {
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
      return !item.isLeaf && this.expandList.includes(item.id)
    },
    handleClick (item) {
      if (item.isLeaf) {
        if (item.id !== this.activeId) {
          this.$emit('select', this.labelInValue ? item : item.id)
        }
      } else {
        const index = item.level || 0
        const list = [...this.expandList]
        if (item.id === this.expandList[index]) {
          list.splice(index, 1)
        } else {
          list.splice(index, 1, item.id)
        }
        this.$emit('expand', list)
      }
    }
  },
  components: {
    MenuItem,
    AutoExpand
  },
  render (h) {
    const renderList = (list) => {
      return list.map(item => {
        const scopedData = {
          item: item,
          actived: this.isActived(item),
          opened: this.isOpened(item)
        }
        const menuItem = (
          <MenuItem
            class="item"
            item={scopedData.item}
            actived={scopedData.actived}
            opened={scopedData.opened}
            scopedSlots={{ extra: this.$scopedSlots['node-extra'] }}
          ></MenuItem>
        )
        return (
          <div key={item.id}>
            <div vOn:click={() => this.handleClick(item)}>
              { this.$scopedSlots.node ? this.$scopedSlots.node(scopedData) : menuItem }
            </div>
            {
              !item.isLeaf && (
                <AutoExpand>
                  <div vShow={scopedData.opened} class="sub-child-list">
                    { renderList(item.children) }
                  </div>
                </AutoExpand>
              )
            }
          </div>
        )
      })
    }
    return <div>{renderList(this.dataSource)}</div>
  }
}
</script>
<style lang="less" scoped>
  // .sub-child-list {
  //   position: relative;
  //   &::before {
  //     content: '';
  //     position: absolute;
  //     left: 30px;
  //     top: 10px;
  //     bottom: 20px;
  //     width: 1px;
  //     background: @border-color-base;
  //   }
  // }
  .sub-child-list .item {
    padding-left: 50px;
  }
</style>
