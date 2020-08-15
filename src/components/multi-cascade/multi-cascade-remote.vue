<template>
  <div class="multi-cascade">
    <template v-for="(data, menuIndex) in showData">
      <Menu class="multi-cascade-menu" :class="menuClass" :key="menuIndex" :data-source="data.list" :loading="menuLoading(menuIndex)" :total="data.total" :load-more="() => handleLoadMore(menuIndex)">
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
  import Menu from './menu'
  import Item from './item'
  import { createRootNode, getNodeStatus, toggleNodeStatus, ALL } from './utils'

  const ALL_NODE = {
    id: ALL,
    name: '全选'
  }

  export default {
    name: 'multi-cascade-remote',
    props: {
      dataSource: Array,
      pageSize: {
        type: Number,
        default: 20
      },
      getData: {
        type: Function,
        default: () => ({
          list: [],
          pagination: {
            pageSize: 20,
            current: 1,
            total: 0
          }
        })
      },
      value: Object,
      showAll: Boolean,
      defaultSelectAll: Boolean,
      checkable: {
        type: Boolean,
        default: true
      },
      menuClass: String,
      itemClass: String
    },
    data () {
      const { showData, valueTree } = this.init()
      return {
        loading: false,
        activePath: [],
        showData,
        valueTree
      }
    },
    watch: {
      value (value) {
        if (value !== this.valueTree) {
          this.valueTree = value
        }
      }
    },
    components: {
      Menu,
      Item
    },
    methods: {
      init () {
        const data = {
          list: [],
          total: 0,
          current: 1
        }
        let valueTree = createRootNode(0, false)
        if (this.dataSource) {
          data.list = (this.showAll ? [ALL_NODE] : []).concat(this.dataSource).map(this.formatItem)
          data.total = this.dataSource.length
          valueTree = this.value || createRootNode(data.total, this.defaultSelectAll)
        } else {
          this.asyncInit()
        }
        return {
          showData: [data],
          valueTree
        }
      },
      async asyncInit () {
        await this.fetchNextMenu(0)
        const data = this.showData[0]
        this.valueTree = this.value || createRootNode(data.total, this.defaultSelectAll)
      },
      isLeaf (item) {
        return item.total <= 0
      },
      menuLoading (index) {
        return this.loading && this.activePath.length === index
      },
      formatItem (item) {
        let total = item.total || 0
        if (!item.total) {
          total = item.children ? item.children.length : 0
        }
        return { ...item, total }
      },
      getStatus (item, menuIndex) {
        const pathList = this.activePath.slice(0, menuIndex)
        return getNodeStatus(this.valueTree, pathList, item)
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
        this.activePath = activePath
        /**
         * 存在children 不请求接口
         */
        if (item.children) {
          showData.push({
            list: item.children.map(this.formatItem),
            total: item.children.length,
            current: 1
          })
        } else {
          this.fetchNextMenu(menuIndex + 1)
          showData.push({
            list: [],
            total: 0,
            current: 1
          })
        }
        this.showData = showData
      },
      handleChecked (status, item, menuIndex) {
        const pathList = this.activePath.slice(0, menuIndex)
        const parentNodeList = pathList.map((id, index) => {
          return this.showData[index].list.find(n => n.id === id)
        })
        this.valueTree = toggleNodeStatus(this.valueTree, parentNodeList, item, status)
        this.$emit('change', this.valueTree)
      },
      async handleLoadMore (menuIndex) {
        const data = this.showData[menuIndex]
        // 没有分页信息 说明不是异步无限加载
        if (data.total <= data.list.length) {
          return
        }
        const current = data.current + 1
        const { list, total } = await this.fetchData(menuIndex, current)
        data.list = [...data.list, ...list]
        data.total = total
        data.current = current
      },
      async fetchNextMenu (menuIndex) {
        // 没有children 需要异步加载
        this.loading = true
        const current = 1
        const { list, total } = await this.fetchData(menuIndex, current)
        const data = this.showData[menuIndex]
        if (menuIndex === 0 && this.showAll) {
          data.list = [ALL_NODE, ...list].map(this.formatItem)
        } else {
          data.list = list.map(this.formatItem)
        }
        data.total = total
        data.current = current
        this.loading = false
      },
      async fetchData (menuIndex = 0, current = 1) {
        try {
          const pageSize = this.pageSize
          const pathList = this.activePath.slice(0, menuIndex)
          const { list, pagination } = await this.getData(pathList, { pageSize, current })
          const dataList = list || []
          const total = pagination ? pagination.total : dataList.length
          return { list: dataList, total }
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @border: 1px solid @border-color-base;
  @menu-height: 220px;
  @menu-width: 180px;

  .multi-cascade {
    background: @component-bg;
    border: @border;
    display: inline-flex;
    overflow: hidden;
    &-menu {
      position: relative;
      width: @menu-width;
      height: @menu-height;
      padding: 0;
      margin: 0;
      &:not(:last-child) {
        border-right: @border;
      }
    }
  }
</style>
