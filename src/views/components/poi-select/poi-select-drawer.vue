<template>
  <Drawer
    class="poi-select-drawer"
    :width="width"
    :value="drawerVisible"
    :closable="false"
    @on-visible-change="handleVisibleChange"
  >
    <PoiSelect
      :pois="poiList"
      :confirm="confirm"
      :query-poi-list="queryPoiList"
      :fetch-poi-list-by-ids="fetchPoiListByIds"
      @on-change="handlePoisChanged"
    />
    <div class="poi-select-drawer-footer">
      <Button type="default" @click="value = false">取消</Button>
      <Button type="primary" @click="handleConfirm">确定</Button>
    </div>
  </Drawer>
</template>

<script>
  import PoiSelect from '@/components/poi/poi-select'
  import { fetchGetPoiList } from '@/data/repos/poi'

  export default {
    name: 'PoiSelectDrawer',
    components: {
      PoiSelect
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      pois: Array,
      width: {
        type: [Number, String],
        default: '80%'
      },
      confirm: {
        type: Boolean,
        default: true
      },
      queryPoiList: {
        type: Function,
        default: (params = {}) => fetchGetPoiList(params.city, params.name, undefined, params.pagination)
      },
      fetchPoiListByIds: Function
    },
    data () {
      return {
        drawerVisible: this.value,
        poiList: this.pois
      }
    },
    watch: {
      value (val) {
        this.drawerVisible = val
      },
      pois (pois) {
        this.poiList = pois
      }
    },
    methods: {
      handleVisibleChange (visible) {
        this.drawerVisible = visible
        this.$emit('input', visible)
        this.$emit('on-visible-change', visible)
      },
      handlePoisChanged (pois) {
        this.poiList = pois
      },
      handleConfirm () {
        if (this.poiList && this.poiList.length) {
          this.$emit('on-confirm', this.poiList)
          this.handleVisibleChange(false)
        } else {
          this.$Message.warning('请选择门店')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .poi-select-drawer {
    .poi-select {
      height: 100%;
      padding-bottom: 36px;

      /deep/ .boo-tabs-content {
        height: calc(100% - 52px);
        .boo-tabs-tabpane
        , .poi-search-table{
          height: 100%;
        }

        .poi-table {
          height: calc(100% - 52px);
        }
      }
    }
  }
  .poi-select-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px 16px;
    text-align: right;

    > .boo-btn {
      margin-left: 10px;
    }
  }
</style>
