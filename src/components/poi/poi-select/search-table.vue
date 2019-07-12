<template>
  <div class="poi-search-table">
    <slot name="search" v-bind:search="handleSearch">
      <div class="search-container">
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
      stripe
      :fetch-data="fetchPoiList"
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

  export default {
    name: 'SearchTable',
    components: {
      PoiTable
    },
    props: {
      confirm: Boolean,
      checkedIds: Array,
      disabledIds: Array,
      fetchPoiList: Function
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
          pageSize: 20
        }
      }
    },
    methods: {
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
      }
    },
    async mounted () {
      const cities = await fetchGetCityList()
      this.cities = cities.map(city => ({
        label: city.name,
        value: city.id
      }))
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
