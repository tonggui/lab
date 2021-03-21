<script>
  import { get, setWith, isArray } from 'lodash'
  import Draggable from 'vuedraggable'
  import AutoExpand from '@/transitions/auto-expand'
  import MenuItem from './menu-item'
  import {
    updateTreeChildrenWith,
    swapArrayByIndex
  } from '@/common/arrayUtils'
  import { defaultTagId } from '@/data/constants/poi'
  import { calculateSelectedTotal } from './model'

  export const TargetProductTag = {
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
      },
      checkBoxList: {
        deep: true,
        handler (val) {
          this.checkBox = val
        }
      }
    },
    computed: {
      allDataSource () {
        if (this.showAllData && this.dataSource.length > 0) {
          const all = {
            ...TargetProductTag,
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
        const parentIdList = item.parentIdList
        const id = item.id
        let selectedTotal = 0
        let checked = {
          value: false,
          indeterminate: false
        }
        let nodePath = null
        if (isLeaf) {
          nodePath = `${parentIdList.join('.selected') ? parentIdList.join('.selected') + '.selected.' : ''}${id}` // 叶子结点路径
        } else {
          nodePath = `${parentIdList.join('.selected') ? parentIdList.join('.selected') + '.' : ''}${id}` // 非叶子结点路径
        }
        const nodeInfo = get(this.checkBox, nodePath)
        if (nodeInfo) {
          checked = nodeInfo.checked
          selectedTotal = nodeInfo.selectedTotal
        }

        return {
          actived,
          opened,
          checked,
          selectedTotal
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
        this.$emit('on-checkbox-change', this.checkBox)
        this.$forceUpdate()
      },
      getTotalNum (parentIdList) {
        let total = 0
        let children = this.dataSource
        parentIdList.forEach(it => {
          const node = children.find(item => item.id === it)
          if (node.children && isArray(node.children)) children = node.children
        })
        total = children.length || 0
        return total
      },
      initNodeInfo (item) {
        const isLeaf = this.isLeaf(item) // 是否叶子节点
        const id = item.id
        const parentIdList = item.parentIdList
        const nodePath = `${parentIdList.join('.selected.') ? parentIdList.join('.selected.') + '.selected.' : ''}${id}` // 叶子结点路径
        if (parentIdList.length) {
          parentIdList.reduce((a, b) => {
            a.push(b)
            const nodePath = a.join('.selected.')
            const nodeInfo = get(this.checkBox, nodePath)
            if (nodeInfo === undefined && nodePath) {
              setWith(this.checkBox, nodePath, {
                selected: {},
                leaf: false,
                checked: { value: false, indeterminate: false },
                total: this.getTotalNum(a),
                selectedTotal: 0
              }, Object)
            }
            return a
          }, [])
        }
        const nodeInfo = get(this.checkBox, nodePath)

        if (nodeInfo === undefined && nodePath) {
          if (isLeaf) {
            setWith(this.checkBox, nodePath, {
              includeSpuIds: [],
              excludeSpuIds: [],
              leaf: true,
              checked: { value: true, indeterminate: false },
              total: item.productCount,
              selectedTotal: 0
              // total: this.getTotalNum(parentIdList.concat(id))
            }, Object)
          } else {
            setWith(this.checkBox, nodePath, {
              selected: {},
              leaf: false,
              checked: { value: true, indeterminate: false },
              total: this.getTotalNum(parentIdList.concat(id)),
              selectedTotal: 0
            }, Object)
            item.children.forEach(child => this.initNodeInfo(child))
          }
        } else if (nodeInfo && !isLeaf) {
          item.children.forEach(child => this.initNodeInfo(child))
        }
      },
      getCheckStatus (checked) {
        let status = 1
        const { value, indeterminate } = checked
        if (value && !indeterminate) status = 1
        else if (value && indeterminate) status = 0.5
        return status
      },
      setCheckStatus (status, node) {
        if (status === 1) {
          node.checked.value = true
          node.checked.indeterminate = false
        } else if (status > 0 && status < 1) {
          node.checked.value = true; node.checked.indeterminate = true
        } else this.deleteSelectedNode(node.parentIdList, node.id)
      },
      upNodesCheckChange (path) {
        if (!path) return
        const nodeInfo = get(this.checkBox, path)
        if (nodeInfo && !nodeInfo.leaf) {
          if (nodeInfo.selected) {
            const res = Object.values(nodeInfo.selected).reduce((a, b) => {
              a *= this.getCheckStatus(b.checked)
              return a
            }, 1)
            if (Object.keys(nodeInfo.selected).length === nodeInfo.total) this.setCheckStatus(res, nodeInfo)
            else this.setCheckStatus(0.5, nodeInfo)
          } else {
            // 删除此节点
            // this.setCheckStatus(0, nodeInfo)
            delete this.checkBox[path]
          }
          nodeInfo.selectedTotal = calculateSelectedTotal(nodeInfo)
        }
      },
      downNodesCheckChange (nodeInfo, checked, item) {
        if (!nodeInfo) return
        nodeInfo.checked = Object.assign({}, checked)
        if (nodeInfo.leaf) {
          const { value, indeterminate } = checked
          if (value && !indeterminate) {
            nodeInfo.includeSpuIds = []
            nodeInfo.excludeSpuIds = []
          }
        }
        nodeInfo.selectedTotal = calculateSelectedTotal(nodeInfo)
        if (!nodeInfo.leaf && nodeInfo.selected) {
          this.initNodeInfo(item)
          Object.entries(nodeInfo.selected).forEach(([key, node]) => {
            this.downNodesCheckChange(node, checked, item.children.find(it => it.id === key))
          })
        }
      },
      deleteSelectedNode (parentIdList, id) {
        // 删除自身节点以及向上节点
        const path = `${parentIdList.join('.selected.') ? parentIdList.join('.selected.') + '.selected' : ''}`
        if (path) delete get(this.checkBox, path)[id]
        else delete this.checkBox[id]

        if (parentIdList.length) {
          for (let i = parentIdList.length; i >= 0; i--) {
            const pNodePath = `${parentIdList.slice(0, i).join('.selected') ? parentIdList.slice(0, i).join('.selected') : ''}` // 非叶子结点路径
            const nodeInfo = get(this.checkBox, pNodePath)
            if (pNodePath && nodeInfo && nodeInfo.selected && !Object.keys(nodeInfo.selected).length) delete nodeInfo['selected']
          }
        }
      },
      handleReset (item) {
        // debugger
        const id = item.id // 节点id
        const parentIdList = item.parentIdList // 父id列表
        // const isLeaf = this.isLeaf(item) // 是否叶子节点
        const nodePath = `${parentIdList.join('.selected.') ? parentIdList.join('.selected.') + '.selected.' : ''}${id}` // 叶子结点路径
        // 判断是否存在，不存在创建
        let nodeInfo = get(this.checkBox, nodePath)
        if (nodeInfo === undefined) {
          this.initNodeInfo(item)
        } else { // 存在则改变自身
          if (nodeInfo.checked.value && !nodeInfo.checked.indeterminate) this.deleteSelectedNode(parentIdList, id)
          else if (nodeInfo.checked.value && nodeInfo.checked.indeterminate) nodeInfo.checked.indeterminate = false
          else nodeInfo.checked = { value: true, indeterminate: false }
        }
        nodeInfo = get(this.checkBox, nodePath)
        // 向下查找
        // debugger
        if (nodeInfo) {
          const checked = nodeInfo.checked
          this.downNodesCheckChange(nodeInfo, checked, item)
        }

        // 向上查找
        for (let i = parentIdList.length; i >= 0; i--) {
          const pNodePath = `${parentIdList.slice(0, i).join('.selected') ? parentIdList.slice(0, i).join('.selected.') : ''}` // 非叶子结点路径
          this.upNodesCheckChange(pNodePath)
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
        const { actived, opened, checked, selectedTotal } = this.getItemStatus(item, parentIdList)
        const scopedData = {
          index: i,
          item,
          actived,
          opened,
          checked,
          selectedTotal
        }
        const handleClick = () => this.handleClick(item)
        let $item
        if (this.$scopedSlots.node) {
          $item = this.$scopedSlots.node(scopedData)
        } else {
          $item = this.renderMenuItem(scopedData)
        }
        const isLeaf = this.isLeaf(item)
        const selectTagId = this.value
        const isExistSelectedTag = function (item) {
          if (item.id === selectTagId) return true
          else if (item.children && item.children.length) {
            return item.children.some(child => {
              return isExistSelectedTag(child)
            })
          } else {
            return false
          }
        }
        return (
          <div key={item.id} style={ isExistSelectedTag(item) ? { background: '#FAFAFC' } : {}}>
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
