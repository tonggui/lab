<template>
  <Drawer
    class="poi-select-drawer"
    :width="width"
    :value="drawerVisible"
    :title="title"
    @on-visible-change="handleVisibleChange"
  >
    <div class="drawer-close" slot="close">
      收起
      <span class="round"><Icon type="navigate-next" size="20" /></span>
    </div>
    <PoiSelect
      v-onlyone="drawerVisible"
      autoresize
      :poi-list="pois"
      :disabled-id-list="disabledIdList"
      :confirm="confirm"
      :query-poi-list="queryPoiList"
      :fetch-poi-list-by-ids="fetchPoiListByIds"
      @on-change="handlePoisChanged"
    />
    <div class="poi-select-drawer-footer">
      <Button type="default" @click="handleVisibleChange(false)">取消</Button>
      <Button type="primary" @click="handleConfirm" v-mc="{ bid: 'b_shangou_online_e_f4nwywyw_mc' }">确定</Button>
    </div>
  </Drawer>
</template>

<script>
  import PoiSelect from '@/components/poi/poi-select'
  import {
    fetchGetPoiList,
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/poi'
  import withOnlyone from '@/hoc/withOnlyone'
  import onlyone from '@/directives/onlyone'

  export default {
    name: 'PoiSelectDrawer',
    components: {
      PoiSelect: withOnlyone(PoiSelect)
    },
    directives: { onlyone },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: String,
      poiList: Array,
      poiIdList: Array,
      width: {
        type: [Number, String],
        default: 1000
      },
      confirm: {
        type: Boolean,
        default: true
      },
      disabledIdList: {
        type: Array,
        default: () => []
      },
      queryPoiList: {
        type: Function,
        default: (params = {}) => fetchGetPoiList(params.name, params.pagination, params.city)
      },
      fetchPoiListByIds: {
        type: Function,
        default: (poiIdList) => fetchGetPoiInfoListByIdList(undefined, poiIdList)
      }
    },
    data () {
      return {
        drawerVisible: this.value,
        pois: this.poiList
      }
    },
    watch: {
      value (val) {
        this.drawerVisible = val
      },
      poiList (poiList) {
        this.pois = poiList
      },
      poiIdList: {
        immediate: true,
        async handler (val) {
          // 优先使用poiList，如果不存在poiList节点且传入poiIdList，则启用并拉取数据
          if (val && !this.poiList) {
            if (val.length && this.fetchPoiListByIds) {
              this.pois = await this.fetchPoiListByIds(val)
            } else {
              this.pois = []
            }
          }
        }
      }
    },
    methods: {
      handleVisibleChange (visible) {
        this.drawerVisible = visible
        this.$emit('input', visible)
        this.$emit('on-visible-change', visible)
      },
      handlePoisChanged (poiList) {
        this.pois = poiList
      },
      handleConfirm () {
        if (this.pois && this.pois.length) {
          this.$emit('on-confirm', this.pois)
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
    .drawer-close {
      padding: 5px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: @primary-color;
      .round {
        @round-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: @round-size;
        height: @round-size;
        border: 1px solid @border-color-base;
        border-radius: 50%;
        margin-left: 10px;
      }
    }
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
