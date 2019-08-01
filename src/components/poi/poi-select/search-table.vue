<template>
  <div class="poi-search-table">
    <slot name="search" v-bind:search="handleSearch">
      <div ref="searchContainer" class="search-container">
        <Selector
          v-model="query.city"
          filterable
          clearable
          placeholder="请输入城市名称搜索"
        >
          <Option v-for="(item, idx) in cities" :key="idx" :value="item.value">{{item.label}}</Option>
        </Selector>
        <Input
          v-model="query.address"
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
  import PoiTable from '../poi-table'
  import { fetchGetCityList } from '@/data/repos/common'
  import storage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'SearchTable',
    components: {
      PoiTable
    },
    props: {
      confirm: Boolean,
      checkedIds: Array,
      disabledIds: Array,
      fetchPoiList: Function,
      height: Number,
      // TODO 后续需要调整，需要支持三种模式 1. 不设定高度，2. 设定高度 3. 撑满并锁定表头
      autoresize: Boolean
    },
    data () {
      return {
        cities: [],
        query: {
          city: null,
          address: ''
        },
        pagination: {
          current: 1,
          total: 0,
          pageSize: storage[KEYS.POI_SELECT_PAGE_SIZE] || 20
        },
        tableHeight: this.height
      }
    },
    methods: {
      handlePoiTableChange (list, pagination) {
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
      handleSearch () {
        this.$refs.poiTable.search()
      },
      add () {
        const pois = this.$refs.poiTable.getCheckedPois()

        if (!pois.length) {
          this.$Message.warning('请先选择门店')
        }

        this.$refs.poiTable.selectAll(false)
        this.$emit('on-select', pois)
      },
      handleResizeEvent () {
        const rect = this.$el.getBoundingClientRect()
        let $searchContainer = this.$refs.searchContainer
        if (this.$slots.search) {
          $searchContainer = this.$slots.search.$el
        }
        const searchContainerRect = $searchContainer.getBoundingClientRect()
        this.tableHeight = rect.height - searchContainerRect.height
      }
    },
    async mounted () {
      const cities = await fetchGetCityList()
      this.cities = cities.map(city => ({
        label: city.name,
        value: city.id
      }))

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
