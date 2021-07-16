<template>
  <Drawer
    class="poi-select-drawer"
    :width="width"
    :value="drawerVisible"
    :title="title"
    :mask-closable="maskClosable"
    @on-visible-change="handleVisibleChange"
  >
    <!-- <div class="drawer-close" slot="close">
      收起
      <span class="round"><Icon type="navigate-next" size="20" /></span>
    </div> -->
    <PoiSelect
      v-model="drawerVisible"
      autoresize
      :poi-list="pois"
      :disabled-id-list="disabledIdList"
      :confirm="confirm"
      :query-poi-list="queryPoiList"
      :query-all-poi-list="queryAllPoiList"
      :fetch-poi-list-by-ids="getPoiListByIds"
      :supportSelectAll="supportSelectAll"
      :input-poi-max ="inputPoiMax"
      @on-change="handlePoisChanged"
      ref="poiSelect"
      v-bind="$attrs"
    >
      <template v-slot:search="props">
        <slot name="search" v-bind="props"></slot>
      </template>
    </PoiSelect>
    <div class="poi-select-drawer-footer" slot="footer">
      <Button type="default" @click="handleVisibleChange(false)">取消</Button>
      <Button type="primary" @click="handleConfirm" v-mc="{ bid: 'b_shangou_online_e_f4nwywyw_mc' }" :loading="submitting">确定</Button>
    </div>
  </Drawer>
</template>

<script>
  import PoiSelect from '@/components/poi/poi-select'
  import {
    fetchGetPoiList,
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/poi'
  import { fetchGetAllPoiList } from '@/data/repos/merchantPoi'
  import layerTableResizeMixin from '@/mixins/layerTableResize'
  import TimeCounters from '@/common/lx/lxReport/lxTime'

  export default {
    name: 'PoiSelectDrawer',
    mixins: [layerTableResizeMixin],
    components: {
      PoiSelect
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      maskClosable: {
        type: Boolean,
        default: false
      },
      title: String,
      poiList: Array,
      poiIdList: Array,
      supportSelectAll: {
        type: Boolean,
        default: true
      },
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
      queryAllPoiList: {
        type: Function,
        default: (params = {}) => fetchGetAllPoiList(params.name, params.city, params.exclude)
      },
      fetchPoiListByIds: {
        type: Function,
        default: (poiIdList) => fetchGetPoiInfoListByIdList(poiIdList)
      },
      createCallback: {
        type: Function,
        default: success => success
      },
      inputPoiMax: {
        type: Number,
        default: 2000
      }
    },
    data () {
      return {
        drawerVisible: this.value,
        pois: this.poiList,
        submitting: false
      }
    },
    watch: {
      value (val) {
        this.drawerVisible = val
      },
      drawerVisible (v) {
        this.tableResize(v)
        if (v && this.$refs.poiSelect) {
          this.$refs.poiSelect.resetData()
          this.pois = this._pois || []
        }
        if (v) {
          TimeCounters.setTime('poi', +new Date())
        } else {
          TimeCounters.setTime('poi', +new Date())
        }
      },
      poiList: {
        immediate: true,
        handler (poiList) {
          this.pois = poiList
        }
      },
      poiIdList: {
        immediate: true,
        async handler (val) {
          // 优先使用poiList，如果不存在poiList节点且传入poiIdList，则启用并拉取数据
          if (val && !this.poiList) {
            if (val.length) {
              // 缓存初始状态，方便之后重置
              this._pois = await this.getPoiListByIds(val)
              this.pois = this._pois || []
            } else {
              this.pois = []
            }
          }
        }
      }
    },
    methods: {
      getPoiListByIds (poiIdList) {
        return this.fetchPoiListByIds ? this.fetchPoiListByIds(poiIdList) : []
      },
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
          this.submitting = true
          this.$emit('on-confirm', this.pois, this.createCallback(callback => {
            if (callback) {
              callback()
            }
            this.submitting = false
            this.handleVisibleChange(false)
          }, () => {
            this.submitting = false
          }))
        } else {
          const config = {
            content: '请选择门店',
            duration: 5,
            top: document.body.clientHeight / 2 - 50,
            left: document.body.clientWidth * (2 / 5)
          }
          this.$Message.warning(config)
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

      /deep/ .boo-tabs {
        position: relative;
        overflow: initial;
        .boo-tabs-tabpane {
          position: absolute;
          top: 52px;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .poi-search-table {
          height: 100%;
        }
        .poi-table {
          overflow: initial;
          height: calc(100% - 52px);
        }
      }
    }
  }
  .poi-select-drawer-footer > .boo-btn {
    margin-left: 10px;
  }
</style>
