<template>
  <Poptip
    placement="bottom-start"
    class="input-style-poptip"
    @on-popper-show="popTipVisible = true"
    @on-popper-hide="popTipVisible = false"
  >
    <FakeInput
      placeholder="请选择商品"
      :active="popTipVisible"
    >
      <template #default v-if="displayStatisticInfo">
        <div v-html="displayStatisticInfo" />
      </template>
    </FakeInput>
    <MultiCascadeRemote
      slot="content"
      show-all
      :data-source="tagList"
      :getData="fetchData"
      @change="handleChange"
    />
  </Poptip>
</template>

<script>
  import differenceBy from 'lodash/differenceBy'
  // import defaultTo from 'lodash/defaultTo'
  import { MultiCascadeRemote } from '@/components/multi-cascade'
  import { ALL } from '@/components/multi-cascade/utils'
  import { fetchGetProductList } from '@/data/repos/merchantProduct'
  import FakeInput from './fake-input'

  export default {
    name: 'ProductSelector',
    components: {
      MultiCascadeRemote,
      FakeInput
    },
    props: {
      tagList: Array,
      fetchProductList: {
        type: Function,
        default: fetchGetProductList
      }
    },
    data () {
      return {
        popTipVisible: false,
        selectedTree: null
      }
    },
    computed: {
      tagMap () {
        const convertTagListToMap = (tagList, map) => tagList.reduce((store, tag) => {
          store[tag.id] = tag
          if (tag.children && tag.children.length) {
            convertTagListToMap(tag.children, store)
          }
          return store
        }, map)
        return convertTagListToMap(this.tagList, {
          [ALL]: {
            _isLeaf: false,
            children: this.tagList
          }
        })
      },
      displayStatisticInfo () {
        const tree = this.selectedTree
        if (tree) {
          const tagCountArr = [0, 0, 0]
          const loopNode = (node, level) => {
            const tag = this.tagMap[node.id]
            const checked = this.isNodeChecked(node)
            console.log(node, level, tag && tag.name, checked)
            // 当前node为店内分类节点
            if (tag) {
              if (checked) {
                if (this.isLeafTag(tag) || node.list.length === 0) {
                  tagCountArr[level] += 1
                  return true
                }
                const childCheckStateList = node.list.map(child => loopNode(child, level + 1))
                console.log(tag.name, checked, JSON.stringify(childCheckStateList), node.total)
                const checkedCount = childCheckStateList.filter(checked => checked).length
                if (checkedCount) {
                  if (checkedCount === node.total) {
                    tagCountArr[level] += 1
                    tagCountArr[level + 1] -= checkedCount
                    return true
                  }
                  return true
                } else {
                  const unCheckedCount = childCheckStateList.filter(checked => !checked).length
                  if (unCheckedCount) {
                    if (unCheckedCount === node.total) {
                      return false
                    }
                    tagCountArr[level + 1] += node.total - unCheckedCount
                    return true
                  }
                  return true
                }
              } else {
                return false
              }
            } else {
              return checked
            }
          }
          loopNode(tree, 0)
          if (tagCountArr.some(count => count > 0)) {
            let result
            if (tagCountArr[0] > 0) {
              result = `<strong>全部</strong>分类`
            } else {
              const tagLevels = ['一级分类', '二级分类']
              result = tagCountArr.slice(1).map((count, idx) => [count, `<strong>${count}个</strong>${tagLevels[idx]}`])
                .filter(([count]) => count > 0)
                .map(([count, text]) => text)
                .join('和')
            }
            if (result) {
              result = `已选择${result}`
            }
            return result
          }
        }
        return null
      },
      submitValue () {
        const valueList = []
        const tree = this.selectedTree
        if (tree) {
          const loopNode = (node, defaultCheckState) => {
            const tag = this.tagMap[node.id]
            if (!tag) return
            let checked = 'checked' in node ? this.isNodeChecked(node) : defaultCheckState
            if (!checked) return

            let childNodeList = node.list || []
            if (this.isLeafTag(tag)) {
              valueList.push({
                id: node.id,
                include: childNodeList.filter(child => child.checked).map(child => child.id),
                exclude: childNodeList.filter(child => !child.checked).map(child => child.id)
              })
            } else {
              // exclude模式
              if (childNodeList.every(child => !this.isNodeChecked(child))) {
                const defaultBehaviourList = differenceBy(tag.children, childNodeList, 'id')
                if (defaultBehaviourList.length) {
                  defaultBehaviourList.forEach(child => loopNode(child, checked))
                }
              }
              childNodeList.forEach(child => loopNode(child, checked))
            }
          }
          loopNode(tree, this.isNodeChecked(tree))
        }
        return valueList
      }
    },
    methods: {
      async fetchData (tagIdPath, pagination) {
        const tagId = tagIdPath.slice(-1)[0]
        const result = await this.fetchProductList({ tagId }, pagination)
        return result
      },
      handleChange (selectedTree) {
        this.selectedTree = selectedTree
        this.$emit('change', selectedTree, this.submitValue)
      },
      isLeafTag (tag) {
        if ('_isLeaf' in tag) {
          return !!tag._isLeaf
        }
      },
      isNodeChecked (node) {
        if (node.total === 0 || node.list.length === 0) {
          return node.checked
        }
        if (node.list.length === node.total) {
          return node.list.every(child => this.isNodeChecked(child)) || !node.list.every(child => !this.isNodeChecked(child))
        }
        if (node.checked) {
          return node.list.filter(child => !this.isNodeChecked(child)).length < node.total
        }
        return node.list.some(child => this.isNodeChecked(child))
      }
    },
    created () {
      window.$vm = this
    }
  }
</script>

<style scoped lang="less">
  .input-style-poptip {
    ///deep/ .boo-poptip-rel {
    //  padding: 3px;
    //}
    /deep/ .boo-poptip-popper {
      padding: 0;
    }
    /deep/ .boo-poptip-body {
      padding: 0;
    }
    /deep/ .boo-poptip-arrow {
      display: none;
    }
  }
</style>
