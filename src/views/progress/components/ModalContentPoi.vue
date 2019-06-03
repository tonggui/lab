<template>
  <div class="modal-content-poi">
    <template v-if="TYPE['SYNC'] === Number(taskType)">
      <h4>主店</h4>
      <Table border :data="[sourcePoi]" :columns="columns" />
      <h4>目标门店</h4>
    </template>
    <div v-if="targetUrl">
      <a :href="targetUrl" target="_blank">下载全部目标门店ID列表</a>
    </div>
    <Table border :data="dataSource.wmPoiList || []" :columns="columns" />
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
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
  },
  methods: {
    handleClickOk () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.modal-content-poi {
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
  }
}
</style>
