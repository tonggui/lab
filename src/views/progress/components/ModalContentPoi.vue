<template>
  <div class="modal-content-poi">
    <template v-if="TYPE[taskType] === 'SYNC'">
      <h4>主店</h4>
      <Table :data="[sourcePoi]" :columns="columns" />
      <h4>目标门店</h4>
    </template>
    <div v-if="targetUrl">
      <a :href="targetUrl" target="_blank">下载全部目标门店ID列表</a>
    </div>
    <Table :data="poiList" :columns="columns" />
  </div>
</template>

<script>
import { TYPE } from '../constants'

export default {
  name: 'modal-content-poi',
  props: {
    dataSource: {
      type: Object,
      required: true
    },
    taskType: {
      type: [Number, String]
    }
  },
  data () {
    return {
      TYPE,
      targetUrl: this.dataSource.targetUrl || '', // 目标门店ID列表下载链接
      poiList: this.dataSource.wmPoiList || [], // 门店详情
      columns: [
        {
          title: '门店ID',
          key: 'wmPoiId'
        },
        {
          title: '门店名称',
          key: 'wmPoiName'
        },
        {
          title: '门店品牌',
          key: 'brandName'
        },
        {
          title: '门店负责人',
          key: 'ownerName'
        }
      ]
    }
  },
  computed: {
    // 跨店同步时主店详情
    sourcePoi () {
      return this.dataSource.sourcePoi ? this.dataSource.sourcePoi[0] : {}
    }
  }
}
</script>

<style lang="" scoped>

</style>
