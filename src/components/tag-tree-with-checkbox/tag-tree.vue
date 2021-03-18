<script>
  import { get, setWith, isArray } from 'lodash'
  import Draggable from 'vuedraggable'
  import AutoExpand from '@/transitions/auto-expand'
  import MenuItem from './menu-item'
  import { defaultTagId } from '@/data/constants/poi'
  import {
    updateTreeChildrenWith,
    swapArrayByIndex
  } from '@/common/arrayUtils'
  const allProductTag = {
    name: '近10天新建商品',
    parentId: -1, // 伪造
    parentName: '',
    parentIdList: [],
    id: defaultTagId,
    isUnCategorized: false,
    productCount: 0,
    level: 0,
    isLeaf: true,
    children: []
  }
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
      },
      showCheckbox: {
        type: Boolean,
        default: true
      },
      checkBoxList: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        expand: this.expandList || [],
        checkBox: this.checkBoxList || {}
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
        const checked = {
          value: false,
          indeterminate: false
        }
        // if (parentIdList.length) {
        //   const checkbox = get(this.checkBox, `${parentIdList.join('.')}.${[item.id]}`)
        //   console.log('checkBox', this.checkBox, checkbox)
        //   if (checkbox !== undefined) {
        //     if (isLeaf) {
        //       checked.value = true
        //       if (checkbox.include.length || checkbox.exclude.length) checked.indeterminate = true
        //     } else {
        //
        //     }
        //   }
        // } else {
        //   const checkbox = this.checkBox[item.id]
        //   if (isLeaf && checkbox) {
        //     checked.value = true
        //     if (checkbox.include.length || checkbox.exclude.length) checked.indeterminate = true
        //   }
        // }
        // console.log('parentIdList', parentIdList, item, checked)

        return {
          actived,
          opened,
          checked
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
        if (this.isLeaf(item)) {
          if (item.id !== this.value) {
            this.$emit('select', this.labelInValue ? item : item.id)
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
      handleClickCheckBox (item) {
        this.handleReset(item)
        this.$forceUpdate()
      },
      getTotalNum (parentIdList) {
        let total = 0
        let children = this.dataSource
        console.log('children', children)
        parentIdList.forEach(it => {
          console.log('it', it, children)
          const node = children.find(item => item.id === it)
          if (node.children && isArray(node.children)) children = node.children
        })
        total = children.length || 0
        return total
      },
      setNodeInfo (parentIdList) {
        // const isLeaf = this.isLeaf(item) // 是否叶子节点
        if (parentIdList.length) {
          parentIdList.reduce((a, b) => {
            a.push(b)
            const nodePath = a.join('.selected')
            const nodeInfo = get(this.checkBox, nodePath)
            const total = this.getTotalNum(a)
            if (nodeInfo === undefined && nodePath) {
              setWith(this.checkBox, nodePath, {
                selected: {},
                leaf: false,
                checked: { value: false, indeterminate: false },
                total: total
              }, Object)
            }
            return a
          }, [])
        }
      },
      handleReset (item) {
        const CheckItemInCheckList = (item) => {
          const id = item.id // 节点id
          const isLeaf = this.isLeaf(item) // 是否叶子节点
          const parentIdList = item.parentIdList // 父id列表
          if (isLeaf) {
            const nodePath = `${parentIdList.join('.selected') ? parentIdList.join('.selected') + '.selected.' : ''}${id}` // 叶子结点路径
            console.log('nodePath', nodePath)
            const nodeInfo = get(this.checkBox, nodePath)
            if (nodeInfo !== undefined) {
              if (nodeInfo.checked.value && !nodeInfo.checked.indeterminate) nodeInfo.checked.value = false
              else if (nodeInfo.checked.value && nodeInfo.checked.indeterminate) nodeInfo.checked.indeterminate = false
              else { nodeInfo.checked.value = false; nodeInfo.checked.indeterminate = false }
            } else {
              this.setNodeInfo(parentIdList)
              setWith(this.checkBox, nodePath, {
                includeSpuIds: [],
                excludeSpuIds: [],
                leaf: true,
                checked: { value: true, indeterminate: false },
                total: this.getTotalNum(parentIdList.concat(id))
              }, Object)
            }
          } else {
            const nodePath = `${parentIdList.join('.selected') ? parentIdList.join('.selected') + '.' : ''}${id}` // 非叶子结点路径
            console.log('nodePath-2', nodePath)

            const nodeInfo = get(this.checkBox, nodePath)
            if (nodeInfo !== undefined) {
              // TODO
            } else {
              this.setNodeInfo(parentIdList)
              setWith(this.checkBox, nodePath, {
                selected: {},
                leaf: false,
                checked: { value: false, indeterminate: false },
                total: this.getTotalNum(parentIdList.concat(id))
              }, Object)
            }
          }
        }
        //   if (parentIds.length) {
        //     if (isLeaf) {
        //       const exist = get(this.checkBox, `${parentIds.join('.')}.${id}`)
        //       if (exist !== undefined) delete get(this.checkBox, parentIds.join('.'))[id]
        //       else {
        //         setWith(this.checkBox, `${parentIds.join('.')}.${id}`, {
        //           includeSpuIds: [],
        //           excludeSpuIds: [],
        //           leaf: true,
        //           total: 0
        //         }, Object)
        //       }
        //     }
        //   } else {
        //     if (isLeaf) {
        //       const exist = this.checkBox[id]
        //       if (exist) delete this.checkBox[id]
        //       else {
        //         this.checkBox[id] = {
        //           includeSpuIds: [],
        //           excludeSpuIds: [],
        //           leaf: true,
        //           total: 0
        //         }
        //       }
        //     }
        //   }
        // }
        if (this.isLeaf(item)) {
          CheckItemInCheckList(item)
        } else {
          item.children.forEach(it => {
            this.handleReset(it)
          })
        }
      },
      renderMenuItem (props) {
        const scopedSlots = {
          extra: this.$scopedSlots['node-extra'],
          tag: this.$scopedSlots['node-tag']
        }
        const isVirtualNode = get(props, 'item.parentId', -1) === -1
        return (
          <MenuItem
            {...{ props }}
            class="tag-tree-item"
            scopedSlots={scopedSlots}
            showTopTime={this.showTopTime}
            showCheckBox={this.showCheckbox && !isVirtualNode}
            on-click-checkbox={this.handleClickCheckBox}
          />
        )
      },
      renderItem (item, parentIdList, i) {
        const { actived, opened, checked } = this.getItemStatus(item, parentIdList)
        console.log('checked', checked, item)
        const scopedData = {
          index: i,
          item,
          actived,
          opened,
          checked
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
      console.log('select', this.checkBox)
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
  background: #F5F6FA;
  &-empty {
    margin-top: 100px;
  }
}
.tag-tree-sub-list .tag-tree-item {
  padding-left: 68px;
  .tag-tree-item-info {
    //padding-left: 10px;
  }
}
</style>
