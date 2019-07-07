<script>
import AutoExpand from '@/transitions/auto-expand'
import MenuItem from './menu-item'

export default {
  name: 'tag-tree',
  props: {
    listTag: {
      type: String,
      default: 'div'
    },
    componentData: {
      type: Object,
      default: () => {}
    },
    transitionName: {
      type: String,
      default: 'list-vertical-animation'
    },
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
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: this.expandList || []
    }
  },
  watch: {
    expandList (newValue) {
      this.expand = newValue
    }
  },
  methods: {
    isActived (item) {
      return item.isLeaf && item.id === this.value
    },
    isOpened (item) {
      return !item.isLeaf && this.expand.includes(item.id)
    },
    handleClick (item) {
      if (item.isLeaf) {
        if (item.id !== this.value) {
          this.$emit('select', this.labelInValue ? item : item.id)
        }
      } else {
        const index = item.level || 0
        const list = [...this.expand]
        if (item.id === this.expand[index]) {
          list.splice(index, 1)
        } else {
          list.splice(index, 1, item.id)
        }
        this.expand = list
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
      let content = list.map((item, i) => {
        const scopedData = {
          index: i,
          item: item,
          actived: this.isActived(item),
          opened: this.isOpened(item)
        }
        const menuItem = (
          <MenuItem
            index={scopedData.index}
            class="tag-tree-item"
            item={scopedData.item}
            actived={scopedData.actived}
            opened={scopedData.opened}
            scopedSlots={{ extra: this.$scopedSlots['node-extra'], tag: this.$scopedSlots['node-tag'] }}
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
                  <div vShow={scopedData.opened} class="tag-tree-sub-list">
                    { renderList(item.children) }
                  </div>
                </AutoExpand>
              )
            }
          </div>
        )
      })
      content = <TransitionGroup name={this.transitionName}>{content}</TransitionGroup>
      return h(this.listTag, this.componentData, [content])
    }
    return (
      <div class="tag-tree">
        { renderList(this.dataSource) }
        { this.dataSource.length <= 0 && this.$slots.empty }
      </div>
    )
  }
}
</script>
<style lang="less">
.tag-tree {
  background: @component-bg;
}
.tag-tree-sub-list .tag-tree-item {
  padding-left: 40px;
  .tag-tree-item-info {
    padding-left: 10px;
  }
}
</style>
