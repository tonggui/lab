<template>
  <div class="modal-content-poi">
    <template v-if="isSync">
      <h4>主店</h4>
      <Table border :data="[sourcePoi]" :columns="columns" />
      <h4>目标门店</h4>
    </template>
    <div v-if="targetUrl" class="target-pois-list">
      <a :href="targetUrl" target="_blank">下载全部目标门店ID列表</a>
    </div>
    <Table border :data="targetPoi" :columns="columns" />
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
      // 是否为批量同步商品
      isSync () {
        return TYPE.SYNC === Number(this.taskType)
      },
      // 跨店同步时主店详情
      sourcePoi () {
        return (this.dataSource && this.dataSource.sourcePoi) ? this.dataSource.sourcePoi[0] : {}
      },
      // 目标门店ID列表下载链接
      targetUrl () {
        return (this.dataSource && this.dataSource.wmPoiUrl) ? this.dataSource.wmPoiUrl : ''
      },
      // 目标门店
      targetPoi () {
        return (this.dataSource && this.dataSource.wmPoiList) ? this.dataSource.wmPoiList : []
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
  h4 {
    padding: 15px 0 10px 0;
  }
  .target-pois-list {
    padding-bottom: 7px;
  }
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
  }
}
</style>
