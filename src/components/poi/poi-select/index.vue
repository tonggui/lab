<template>
  <div class="poi-select" :class="{ 'no-confirm': !confirm }">
    <Tabs class="poi-select-tabs" v-model="tab" :animated="false">
      <TabPane v-if="searchVisible" label="搜索" name="search">
        <PoiSearchTable
          :autoresize="autoresize"
          :confirm="confirm"
          :checked-ids="checkedIds"
          :disabled-ids="disabledIds"
          :fetch-poi-list="queryPoiList"
          @on-select="addSelected"
        />
      </TabPane>
      <TabPane v-if="inputVisible" label="按ID批量选择" name="input">
        <PoiInput v-model="poiIds" :fetch-data="fetchPoiListByIds" @on-select-pois="addSelected"/>
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
      pois: {
        type: Array,
        default: () => []
      },
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
      checkedIds () {
        return this.selected.map(poi => poi.id)
      },
      disabledIds () {
        return this.selected.map(poi => poi.id)
      }
    },
    watch: {
      pois: {
        immediate: true,
        handler (pois = []) {
          // 避免重复无效渲染
          if (pois === this.selected) return
          this.selected = [].concat(pois)
        }
      }
    },
    methods: {
      handleSelectedPoiChanged (pois) {
        this.selected = pois
        this.triggerPoisChanged(this.selected)
      },
      addSelected (selectedPois) {
        // TODO 去重
        this.selected = this.selected.concat(selectedPois)
        this.triggerPoisChanged(this.selected)
      },
      triggerPoisChanged (pois) {
        this.$emit('on-change', pois)
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
