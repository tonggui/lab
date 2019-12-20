<template>
  <div class="multi-cascade">
    <template v-for="(data, menuIndex) in showData">
      <Menu class="multi-cascade-menu" :class="menuClassName" :key="menuIndex" :data-source="data" :scrollable="false">
        <template v-slot:item="{ item }">
          <Item
            :data="item"
            v-bind="getStatus(item, menuIndex)"
            :checkable="checkable"
            @select="handleSelect(item, menuIndex)"
            @checked="handleChecked($event, item, menuIndex)"
            class="multi-cascade-menu-item"
            :active="activePath[menuIndex] === item.id"
            :class="itemClass"
          />
        </template>
      </Menu>
    </template>
  </div>
</template>
<script>
  import ClassNames from 'classnames'
  import Menu from './menu'
  import Item from './item'
  import { ALL } from './utils'

  const ALL_NODE = {
    id: ALL,
    name: '全选'
  }

  export default {
    name: 'multi-cascade-local',
    props: {
      dataSource: Array,
      value: {
        type: Array,
        default: () => []
      },
      showAll: Boolean,
      checkable: {
        type: Boolean,
        default: true
      },
      defaultSelectAll: Boolean,
      needParent: Boolean,
      menuClass: String,
      itemClass: String
    },
    data () {
      const dataSource = this.dataSource.map(item => ({ ...item, total: item.children.length }))
      return {
        activePath: [],
        showData: this.showAll ? [[ALL_NODE, ...dataSource]] : [dataSource]
      }
    },
    computed: {
      full () {
        return this.dataSource.every(item => this.isLeaf(item))
      },
      menuClassName () {
        return ClassNames([this.menuClass, {
          'is-full': this.full
        }])
      }
    },
    components: {
      Menu,
      Item
    },
    mounted () {
      if (this.defaultSelectAll) {
        this.handleAllChecked(true)
      }
    },
    methods: {
      isLeaf (item) {
        return !item.children || item.children.length <= 0
      },
      traverse (dataSource, value) {
        dataSource.forEach((data) => {
          const isLeaf = this.isLeaf(data)
          if (isLeaf || this.needParent) {
            value.push(data.id)
          }
          if (!isLeaf) {
            this.traverse(data.children, value)
          }
        })
        return value
      },
      getStatus (item, menuIndex) {
        const isLeaf = this.isLeaf(item)
        let selected = false
        let checked = false
        if (isLeaf) {
          selected = this.value.includes(item.id)
          checked = selected
        } else {
          selected = false
          checked = true
          item.children.forEach(i => {
            if (this.value.includes(i.id)) {
              selected = true
            } else {
              checked = false
            }
          })
        }
        return { selected, checked }
      },
      handleSelect (item, menuIndex) {
        // 点击的是叶子节点 直接触发选择 select => checked
        if (this.isLeaf(item)) {
          const { checked } = this.getStatus(item, menuIndex)
          this.handleChecked(!checked, item, menuIndex)
          return
        }
        // 当前点击的item 已经展开了
        if (this.activePath[menuIndex] === item.id) {
          return
        }
        const activePath = this.activePath.slice(0, menuIndex)
        const showData = this.showData.slice(0, menuIndex + 1)
        activePath.push(item.id)

        showData.push(item.children.map(i => ({ ...i, total: i.children.length })))
        this.showData = showData
        this.activePath = activePath
      },
      handleChecked (status, item, menuIndex) {
        if (item.id === ALL) {
          this.handleAllChecked(status)
          return
        }
        const isLeaf = this.isLeaf(item)
        let value = [...this.value]
        if (isLeaf) {
          if (!status) {
            value = value.filter(i => i !== item.id)
          } else {
            value.push(item.id)
          }
        } else {
          const childrenIdList = item.children.map(i => i.id)
          const idList = this.needParent ? [item.id, ...childrenIdList] : childrenIdList
          if (!status) {
            value = value.filter(i => !idList.includes(i))
          } else {
            idList.forEach(id => {
              const include = value.includes(id)
              if (!include) {
                value.push(id)
              }
            })
          }
        }
        value = this.triggerParentNode(value, menuIndex)
        this.$emit('change', value)
        this.$emit('input', value)
      },
      handleAllChecked (status) {
        let value = this.value
        if (!status) {
          value = []
        } else {
          value = this.traverse(this.dataSource, [])
        }
        this.$emit('change', value)
        this.$emit('input', value)
      },
      triggerParentNode (value, menuIndex) {
        const parentId = this.activePath[menuIndex - 1]
        if (!parentId) {
          return value
        }
        const parentNode = this.showData[menuIndex - 1].find(n => n.id === parentId)
        if (!parentNode) {
          return value
        }
        const selected = parentNode.children.some(i => value.includes(i.id))
        const index = value.findIndex(v => v === parentId)
        if (!selected && index >= 0) {
          value.splice(index, 1)
          return value
        }
        if (index < 0 && selected) {
          value.push(parentId)
          return value
        }
        return value
      }
    }
  }
</script>
<style scoped lang="less">
  @menu-height: 220px;
  @menu-width: 180px;

  .multi-cascade {
    background: #FAFAFA;
    border: 1px solid #F6F6F7;
    display: inline-flex;
    overflow: hidden;
    &-menu {
      position: relative;
      width: @menu-width;
      height: @menu-height;
      padding: 0;
      margin: 0;
      background: transparent;
      &.is-full {
        width: 100%!important;
      }
      &:first-child {
        background: #fff;
      }
    }
  }
</style>
