<template>
  <div class="poi-select" :class="{ 'no-confirm': !confirm }">
    <Tabs class="poi-select-tabs" v-model="tab" :animated="false">
      <TabPane v-if="searchVisible" label="搜索" name="search">
        <PoiSearchTable
          :confirm="confirm"
          :checked-ids="checkedIds"
          :disabled-ids="disabledIds"
          :fetch-poi-list="fetchGetPoiList"
          @on-select="addSelected"
        />
      </TabPane>
      <TabPane v-if="inputVisible" label="按ID批量选择" name="input">
        <PoiInput v-model="poiIds" :fetch-data="fetchPois" />
      </TabPane>
    </Tabs>
    <PoiList
      class="poi-select-result"
      v-if="confirm"
      :pois="selected"
      @on-change="handleSelectedPoiChanged"
    />
  </div>
</template>

<script>
  import PoiInput from './input'
  import PoiSearchTable from './search-table'
  import PoiList from '../poi-list'
  import { fetchGetPoiList } from '@/data/repos/poi'

  const SUPPORT_MODE = ['search', 'input']

  export default {
    name: 'PoiSelect',
    components: {
      PoiInput,
      PoiSearchTable,
      PoiList
    },
    props: {
      support: {
        type: Array,
        default: () => ['search'],
        validator (value) {
          return value.every(i => SUPPORT_MODE.includes(i))
        }
      },
      confirm: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        tab: this.support[0],
        poiIds: [],
        selected: []
      }
    },
    computed: {
      searchVisible () {
        return this.support.includes('search')
      },
      inputVisible () {
        return this.support.includes('input')
      },
      checkedIds () {
        return this.selected.map(poi => poi.id)
      },
      disabledIds () {
        return this.selected.map(poi => poi.id)
      }
    },
    methods: {
      fetchGetPoiList (params = {}) {
        return fetchGetPoiList(params.city, params.name, undefined, params.pagination)
      },
      fetchPois () {
        return [
          {
            id: '123',
            name: '123asd',
            address: '北京市'
          }, {
            id: 465,
            name: '465asd',
            address: '上海市'
          }
        ]
      },
      addPoisFromTable () {},
      handleSelectedPoiChanged (pois) {
        this.selected = pois
      },
      addSelected (selectedPois) {
        this.selected = this.selected.concat(selectedPois)
      }
    }
  }
</script>

<style scoped lang="less">
  .poi-select {
    display: flex;

    .poi-select-tabs {
      background: @component-bg;
      flex: 6;
      border: 1px solid @border-color-base;

      /deep/ .boo-tabs-tabpane {
        padding: 16px;
        padding-top: 0;
      }
    }

    .poi-select-result {
      flex: 4;
      border: 1px solid @border-color-base;
      margin-left: 12px;
    }

    /deep/ .ids-input {
      min-height: 300px;
    }

    &.no-confirm {
      .poi-select-tabs {
        border: none;
      }
      /deep/ .ids-input .ids-input-add {
        display: none
      }
    }
  }
</style>
