<script>
  import Draggable from 'vuedraggable'
  import AutoExpand from '@/transitions/auto-expand'
  import MenuItem from './menu-item'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import {
    updateTreeChildrenWith,
    swapArrayByIndex
  } from '@/common/arrayUtils'
  import lx from '@/common/lx/lxReport'
  import { get } from 'lodash'

  export default {
    name: 'tag-tree',
    props: {
      loading: Boolean,
      draggable: Boolean,
      draggableHandle: String,
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
      isLeaf (item) {
        return !item.children || item.children.length <= 0
      },
      getItemStatus (item) {
        const isLeaf = this.isLeaf(item)
        const actived = isLeaf && item.id === this.value
        const opened = !isLeaf && this.expand.includes(item.id)
        return {
          actived,
          opened
        }
      },
      handleSortEnd (list, parentIdList, { oldIndex, newIndex }) {
        if (!list || list.length <= 0) {
          return
        }
        // 互换位置
        const dataList = swapArrayByIndex(list, oldIndex, newIndex)
        // 更新
        const result = updateTreeChildrenWith([...this.dataSource], parentIdList, () => {
          return dataList
        })
        this.$emit('sort', result, dataList[newIndex], dataList)
      },
      handleClick (item) {
        let parentIndex = 0
        let childIndex = 0
        try {
          parentIndex = this.dataSource.findIndex(pa => pa.id === item.parentId)
          childIndex = get(this.dataSource, `[${parentIndex}]children`, []).findIndex(child => child.id === item.id)
        } catch (err) {
          console.log(err)
        } finally {
          lx.mc({
            bid: 'b_shangou_online_e_jyosahrh_mc',
            val: {
              category1_id: item.parentId,
              category2_id: item.id,
              index: [parentIndex, childIndex],
              select_time: +new Date(),
              page_source: window.page_source || ''
            }
          })
        }
        if (this.isLeaf(item)) {
          if (item.id !== this.value) {
            this.$emit('select', this.labelInValue ? item : item.id, item.parentId)
          }
        } else {
          const index = item.level || 0
          const list = [...this.expand]
          if (item.id === this.expand[index]) { // 收起
            list.splice(index, 1)
          } else { // 打开
            list.splice(index, 1, item.id)
          }
          this.expand = list
          this.$emit('expand', list)
        }
      },
      renderMenuItem (props) {
        const scopedSlots = {
          extra: this.$scopedSlots['node-extra'],
          tag: this.$scopedSlots['node-tag']
        }
        return (
          <MenuItem
            {...{ props }}
            class="tag-tree-item"
            scopedSlots={scopedSlots}
            showTopTime={this.showTopTime}
          />
        )
      },
      renderItem (item, parentIdList, i) {
        const { actived, opened } = this.getItemStatus(item)
        const scopedData = {
          index: i,
          item,
          actived,
          opened
        }
        const handleClick = () => this.handleClick(item)
        let $item
        if (this.$scopedSlots.node) {
          $item = this.$scopedSlots.node(scopedData)
        } else {
          $item = this.renderMenuItem(scopedData)
        }
        const isLeaf = this.isLeaf(item)
        return (
          <div key={item.id}>
            <div vOn:click={handleClick}>
              { $item }
            </div>
            {
              !isLeaf && (
                <AutoExpand>
                  <div vShow={opened} class="tag-tree-sub-list">
                    { this.renderList(item.children, [...parentIdList, item.id]) }
                  </div>
                </AutoExpand>
              )
            }
          </div>
        )
      },
      renderList (list, parentIdList = []) {
        const content = (
          <TransitionGroup name={this.transitionName} tag="div">
            { list.map((item, i) => this.renderItem(item, parentIdList, i)) }
          </TransitionGroup>
        )
        if (this.draggable) {
          const handleSortEnd = (evt) => this.handleSortEnd(list, parentIdList, evt)
          return (
            <Draggable
              value={list}
              onEnd={handleSortEnd}
              handle={this.draggableHandle}
              animation={200}
              ghostClass="tag-tree-ghost"
            >
              { content }
            </Draggable>
          )
        }
        return content
      }
    },
    components: {
      MenuItem,
      AutoExpand
    },
    render (h) {
      const isEmpty = !this.loading && this.dataSource.length <= 0
      const $empty = this.$slots.empty || <Empty description="暂无分类" />
      return (
      <div class="tag-tree">
        { !isEmpty && this.renderList(this.allDataSource) }
        { isEmpty && <div class="tag-tree-empty">{ $empty }</div> }
      </div>
    )
    }
  }
</script>
<style lang="less">
.tag-tree {
  background: @component-bg;
  &-empty {
    margin-top: 100px;
  }
}
.tag-tree-sub-list .tag-tree-item {
  padding-left: 40px;
  .tag-tree-item-info {
    padding-left: 10px;
  }
}
</style>
