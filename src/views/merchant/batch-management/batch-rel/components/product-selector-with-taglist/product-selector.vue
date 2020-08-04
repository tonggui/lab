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
        return convertTagListToMap(this.tagList, {})
      },
      displayStatisticInfo () {
        const tree = this.selectedTree
        if (tree) {
          if (tree.id === ALL) {
            if (tree.checked && tree.list.length === 0) {
              return `已选择<strong>全部</strong>商品`
            } else {
              const tagCountArr = [0, 0]
              const loopNode = (node, level) => {
                const tag = node.id === ALL ? { _isLeaf: false } : this.tagMap[node.id]
                // 当前node为店内分类节点
                if (tag) {
                  const result = (node.list || []).map(child => loopNode(child, level + 1))
                  if (node.checked) {
                    const unCheckedCount = result.filter(checked => !checked).length
                    if (this.isLeafTag(tag) || unCheckedCount === 0) {
                      tagCountArr[level] += 1
                    } else if (unCheckedCount > 0) {
                      tagCountArr[level + 1] += node.total - unCheckedCount
                    }
                    return unCheckedCount === 0
                  } else {
                    const checkedCount = result.filter(checked => !!checked).length
                    if (this.isLeafTag(tag)) {
                      if (checkedCount > 0) {
                        tagCountArr[level] += 1
                      }
                      return checkedCount > 0
                    } else {
                      if (checkedCount > 0 && checkedCount === node.total) {
                        tagCountArr[level] += 1
                        tagCountArr[level + 1] -= checkedCount
                        return true
                      } else {
                        return false
                      }
                    }
                  }
                } else {
                  return node.checked
                }
              }
              loopNode(tree, -1)
              if (tagCountArr.some(count => count > 0)) {
                const tagLevels = ['一级分类', '二级分类']
                return tagCountArr.map((count, idx) => [count, `<strong>${count}个</strong>${tagLevels[idx]}`])
                  .filter(([count]) => count > 0)
                  .map(([count, text]) => text)
                  .join('和')
              }
            }
          }
        }
        return null
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
      },
      isLeafTag (tag) {
        if ('_isLeaf' in tag) {
          return !!tag._isLeaf
        }
      }
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
