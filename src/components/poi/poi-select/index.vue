<template>
  <div class="poi-select" :class="{ 'no-confirm': !confirm }">
    <Tabs class="poi-select-tabs" v-model="tab" :animated="false">
      <TabPane v-if="searchVisible" label="搜索" name="search">
        <PoiSearchTable
          :autoresize="autoresize"
          :confirm="confirm"
          :disabledMap="searchTableDisabledIdMap"
          :fetch-poi-list="queryPoiList"
          @on-select="addSelected"
        >
          <template v-slot:search="props">
            <slot name="search" v-bind="props"></slot>
          </template>
        </PoiSearchTable>
      </TabPane>
      <TabPane v-if="inputVisible" label="按ID批量选择" name="input">
        <PoiInput v-model="poiIds" :fetch-data="fetchPoiListByIds" @on-select-pois="addSelected"/>
      </TabPane>
    </Tabs>
    <PoiList
      class="poi-select-result"
      v-if="confirm"
      :poi-list="selected"
      :disabled-id-list="disabledIdList"
      @on-change="handleSelectedPoiChanged"
    />
  </div>
</template>

<script>
  import PoiInput from './input'
  import PoiSearchTable from './search-table'
  import PoiList from '../poi-list'

  const SUPPORT_MODE = ['search', 'input']

  export default {
    name: 'PoiSelect',
    components: {
      PoiInput,
      PoiSearchTable,
      PoiList
    },
    props: {
      autoresize: Boolean,
      poiList: {
        type: Array,
        default: () => []
      },
      disabledIdList: {
        type: Array,
        default: () => []
      },
      support: {
        type: Array,
        default: () => ['search', 'input'],
        validator (value) {
          return value.every(i => SUPPORT_MODE.includes(i))
        }
      },
      confirm: {
        type: Boolean,
        default: true
      },
      queryPoiList: Function,
      fetchPoiListByIds: Function
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
      searchTableDisabledIdMap () {
        const set = new Set()
        this.selected.forEach(poi => set.add(poi.id))
        this.disabledIdList.forEach(id => set.add(id))
        const map = {}
        for (let id of set) {
          map[id] = 1
        }
        return map
      }
    },
    watch: {
      poiList: {
        immediate: true,
        handler (poiList = []) {
          // 避免重复无效渲染
          if (poiList === this.selected) return
          this.selected = [].concat(poiList)
        }
      }
    },
    methods: {
      handleSelectedPoiChanged (poiList) {
        this.selected = poiList
        this.triggerPoisChanged(this.selected)
      },
      addSelected (selectedPois) {
        // TODO 去重
        this.selected = this.selected.concat(selectedPois)
        this.triggerPoisChanged(this.selected)
      },
      triggerPoisChanged (poiList) {
        this.$emit('on-change', poiList)
      }
    }
  }
</script>

<style scoped lang="less">
  .poi-select {
    display: flex;
    flex-direction: row;

    .poi-select-tabs {
      background: @component-bg;
      width: 60%;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;

      /deep/ .boo-tabs-tabpane {
        padding: 16px;
        padding-top: 0;
        margin-top: 10px;
      }
    }

    .poi-select-result {
      width: 40%;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
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
