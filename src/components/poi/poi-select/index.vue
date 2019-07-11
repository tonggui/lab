<template>
  <div class="poi-select" :class="{ 'no-confirm': !confirm }">
    <Tabs class="poi-select-tabs" v-model="tab" :animated="false">
      <TabPane label="搜索" name="search">
        <PoiTable :data="pois" stripe />
      </TabPane>
      <TabPane label="按ID批量选择" name="input">
        <PoiInput v-model="poiIds" :fetch-data="fetchPois" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import PoiInput from './input'
  import PoiTable from '../poi-table'

  const SUPPORT_MODE = ['search', 'input']

  export default {
    name: 'PoiSelect',
    components: {
      PoiInput,
      PoiTable
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
        pois: [{
          id: '123',
          name: '123asd',
          address: '北京市'
        }, {
          id: 465,
          name: '465asd',
          address: '上海市'
        }],
        poiIds: []
      }
    },
    methods: {
      fetchPois () {
        return this.pois
      }
    }
  }
</script>

<style scoped lang="less">
  .poi-select {
    /deep/ .ids-input {
      min-height: 300px;
    }

    .poi-select-tabs {
      background: @component-bg;

      /deep/ .boo-tabs-tabpane {
        padding: 16px;
        padding-top: 0;
      }
    }

    &.no-confirm {
      /deep/ .ids-input .ids-input-add {
        display: none
      }
    }
  }
</style>
