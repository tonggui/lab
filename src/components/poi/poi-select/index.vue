<template>
  <div class="poi-select" :class="{ 'no-confirm': !confirm }">
    <Tabs class="poi-select-tabs" v-model="tab" :animated="false">
      <TabPane v-if="searchVisible" label="搜索" name="search">
        <PoiSearchTable
          ref="searchTable"
          :supportSelectAll="supportSelectAll"
          :autoresize="autoresize"
          :confirm="confirm"
          :disabledMap="searchTableDisabledIdMap"
          :fetch-poi-list="queryPoiList"
          :fetch-all-poi-list="queryAllPoiList"
          @on-select="addSelected"
        >
          <template v-slot:search="props">
            <slot name="search" v-bind="props"></slot>
          </template>
        </PoiSearchTable>
      </TabPane>
      <TabPane v-if="inputVisible" label="按ID批量选择" name="input">
        <PoiInput ref="poiInput" v-model="poiIds" :fetch-data="fetchPoiListByIds" :max="inputPoiMax" @on-select-pois="addSelected"/>
      </TabPane>
    </Tabs>
    <PoiList
      class="poi-select-result"
      v-if="confirm"
      :poi-list="selected"
      :disabled-id-map="disabledIdMap"
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
      supportSelectAll: {
        type: Boolean,
        default: true
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
      queryAllPoiList: Function,
      fetchPoiListByIds: Function,
      inputPoiMax: {
        type: Number,
        default: 2000
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
      disabledIdMap () {
        const map = {}
        this.disabledIdList.forEach(v => {
          map[v] = 1
        })
        return map
      },
      searchTableDisabledIdMap () {
        const map = {}
        this.selected.forEach(v => {
          map[v.id] = 1
        })
        return { ...this.disabledIdMap, ...map }
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
      resetData () {
        this.tab = this.support[0]
        if (this.$refs.poiInput) {
          this.$refs.poiInput.clear()
        }
        if (this.$refs.searchTable) {
          this.selected = [].concat(this.poiList)
          this.$refs.searchTable.reset()
        }
      },
      handleSelectedPoiChanged (poiList) {
        this.selected = poiList
        this.triggerPoisChanged(this.selected)
      },
      addSelected (selectedPois = []) {
        // 过滤已有的, 并把disabled置顶
        const noneExist = (selectedPois || []).filter(item => !this.searchTableDisabledIdMap[item.id])
        const newList = noneExist.concat(this.selected)
        const disableList = []
        const availableList = []
        newList.forEach(item => {
          if (this.disabledIdMap[item.id]) {
            disableList.push(item)
          } else {
            availableList.push(item)
          }
        })
        this.selected = disableList.concat(availableList)
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
