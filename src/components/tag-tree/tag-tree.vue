<script>
  import Draggable from 'vuedraggable'
  import AutoExpand from '@/transitions/auto-expand'
  import MenuItem from './menu-item'
  import {
    allProductTag
  } from '@/data/constants/poi'

  export default {
    name: 'tag-tree',
    props: {
      draggable: Boolean,
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
      },
      showTopTime: {
        type: Boolean,
        default: true
      },
      showAllData: {
        type: Boolean,
        default: false
      },
      productCount: {
        type: Number,
        default: undefined
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
    computed: {
      allDataSource () {
        if (this.showAllData && this.dataSource.length > 0) {
          const all = {
            ...allProductTag,
            productCount: this.productCount
          }
          return [all, ...this.dataSource]
        }
        return this.dataSource
      }
    },
    methods: {
      isActived (item) {
        return item.isLeaf && item.id === this.value
      },
      isOpened (item) {
        return !item.isLeaf && this.expand.includes(item.id)
      },
      handleSortChange (list) {
        if (!list || list.length <= 0) {
          return
        }
        let dataList = [...list]
        const node = list[0]
        const parentId = node.parentId || allProductTag.id
        if (parentId !== allProductTag.id) {
          dataList = [...this.dataSource]
          const parentIndex = dataList.findIndex(node => node.id === parentId)
          const parentNode = dataList[parentIndex]
          if (!parentNode) {
            return
          }
          dataList.splice(parentIndex, 1, {
            ...parentNode,
            children: [...list]
          })
        }
        this.$emit('sort', dataList)
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
            showTopTime={this.showTopTime}
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
        const node = {}
        const _that = this
        Object.defineProperty(node, 'value', {
          get () {
            return list
          },
          set (sortList) {
            _that.handleSortChange(sortList)
          }
        })
        if (this.draggable) {
          return <Draggable vModel={node.value} handle=".handle" animation={200} ghostClass="tag-tree-ghost">{ content }</Draggable>
        }
        return <div>{ content }</div>
      }
      const isEmpty = this.dataSource.length <= 0
      const $empty = this.$slots.empty || <Empty />
      return (
      <div class="tag-tree">
        { !isEmpty && renderList(this.allDataSource) }
        { isEmpty && $empty }
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
