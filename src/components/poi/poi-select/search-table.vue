<template>
  <div class="poi-search-table">
    <slot name="search" v-bind:search="handleSearch">
      <div ref="searchContainer" class="search-container">
        <CitySelector v-model="query.city" placeholder="请输入城市名称搜索" clearable />
        <Input
          v-model="query.name"
          placeholder="输入门店名称"
        />
        <Button icon="search" type="primary" @click="handleSearch">搜索</Button>
      </div>
    </slot>
    <PoiTable
      :query="query"
      :checked-ids="checkedIds"
      :disabled-ids="disabledIds"
      :height="tableHeight"
      :pageOptions="pagination"
      stripe
      :fetch-data="fetchPoiList"
      @on-change="handlePoiTableChange"
      @on-select="handleSelectEvent"
      @on-select-cancel="handleSelectCancelEvent"
      @on-select-all="handleSelectAllEvent"
      @on-select-all-cancel="handleSelectAllCancelEvent"
      ref="poiTable">
      <Button
        v-if="confirm"
        slot="footer-extras"
        type="primary"
        @click="add"
      >添加</Button>
    </PoiTable>
  </div>
</template>

<script>
  import CitySelector from '@components/city-selector'
  import PoiTable from '../poi-table'
  import storage, { KEYS } from '@/common/local-storage'
  import unionBy from 'lodash/unionBy'
  import differenceBy from 'lodash/differenceBy'

  export default {
    name: 'SearchTable',
    components: {
      PoiTable,
      CitySelector
    },
    props: {
      confirm: Boolean,
      checkedPoiList: {
        type: Array,
        default: () => []
      },
      // 跨页选择开关
      crossPageSelection: {
        type: Boolean,
        default: true
      },
      disabledIds: Array,
      fetchPoiList: Function,
      height: Number,
      // TODO 后续需要调整，需要支持三种模式 1. 不设定高度，2. 设定高度 3. 撑满并锁定表头
      autoresize: Boolean
    },
    data () {
      return {
        query: {
          city: null,
          name: ''
        },
        pagination: {
          current: 1,
          total: 0,
          pageSize: storage[KEYS.POI_SELECT_PAGE_SIZE] || 20
        },
        tableHeight: this.height,
        selection: [],
        // 添加此项解决目前on-select-all-cancel缺数据的场景
        tableList: []
      }
    },
    computed: {
      checkedIds () {
        return this.selection.map(poi => poi.id)
      }
    },
    watch: {
      checkedPoiList: {
        immediate: true,
        handler (newVal, oldVal) {
          // 删除场景，移除删除项并保留剩余选择项
          // 添加场景，合并新添加的项
          const removedPoiList = differenceBy(oldVal, newVal, 'id')
          if (removedPoiList.length) {
            this.selection = differenceBy(this.selection, removedPoiList, 'id')
          } else {
            this.selection = unionBy(this.selection, newVal, 'id')
          }
        }
      }
    },
    methods: {
      resetSelection (selection) {
        this.selection = [].concat(selection)
      },
      handlePoiTableChange (list, pagination) {
        if (!this.crossPageSelection) {
          this.resetSelection(this.checkedPoiList)
        }
        this.tableList = list
        // pagesize 变化记录缓存
        if (this.pagination.pageSize !== pagination.pageSize) {
          storage[KEYS.POI_SELECT_PAGE_SIZE] = pagination.pageSize
        }
        this.pagination = {
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize
        }
      },
      async handleSearch () {
        await this.$refs.poiTable.search()
      },
      add () {
        // 添加去重处理，传入的已选门店不在作为选中项上报
        const selection = differenceBy(this.selection, this.checkedPoiList, 'id')

        if (!selection.length) {
          this.$Message.warning('请先选择门店')
        }

        this.$refs.poiTable.selectAll(false)
        this.$emit('on-select', selection)
      },
      handleResizeEvent () {
        const rect = this.$el.getBoundingClientRect()
        let $searchContainer = this.$refs.searchContainer
        if (this.$slots.search) {
          $searchContainer = this.$slots.search.$el
        }
        const searchContainerRect = $searchContainer.getBoundingClientRect()
        this.tableHeight = rect.height - searchContainerRect.height
      },
      handleSelectEvent (selection, row) {
        this.handlePoiTableSelectionChange(true, [row], selection)
      },
      handleSelectCancelEvent (selection, row) {
        this.handlePoiTableSelectionChange(false, [row], selection)
      },
      handleSelectAllEvent (selection) {
        this.handlePoiTableSelectionChange(true, selection, selection)
      },
      handleSelectAllCancelEvent (selection) {
        const changedRows = differenceBy(this.tableList, selection, 'id')
        this.handlePoiTableSelectionChange(false, changedRows, selection)
      },
      handlePoiTableSelectionChange (selected, changedRows, selection) {
        if (selected) {
          this.selection = unionBy(this.selection, selection, 'id')
        } else {
          this.selection = differenceBy(this.selection, changedRows, 'id')
        }
      }
    },
    async mounted () {
      if (this.autoresize) {
        window.addEventListener('resize', this.handleResizeEvent)
        this.handleResizeEvent()
      }
    },
    destroy () {
      if (this.autoresize) {
        window.removeEventListener('resize', this.handleResizeEvent)
      }
    }
  }
</script>

<style scoped lang="less">
  .poi-search-table {
    .search-container {
      display: flex;
      padding-bottom: 16px;
      margin: 0 -10px;

      > * {
        margin: 0 8px;
      }
    }
  }
</style>
