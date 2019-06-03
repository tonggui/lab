<template>
  <div class="modal-content-detail-update">
    <Table border :data="dataSource.data || []" :columns="columns" />
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
  </div>
</template>

<script>
import { MUT_MODE_STR, SELL_STATUS_STR } from '../constants'

export default {
  name: 'modal-content-detail-update',
  props: {
    dataSource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      columns: [
        {
          title: '匹配方式',
          key: 'mode',
          render: (h, { row }) => {
            return h('span', MUT_MODE_STR[row.mode])
          }
        }, {
          title: '匹配条件',
          key: 'condition'
        }, {
          title: '商品名称',
          key: 'productName'
        }, {
          title: '库存',
          key: 'stock'
        }, {
          title: '价格',
          key: 'price'
        }, {
          title: '售卖状态',
          key: 'sellStatus',
          render: (h, { row }) => {
            return h('span', SELL_STATUS_STR[row.sellStatus])
          }
        }, {
          title: '重量',
          key: 'weight'
        }, {
          title: '餐盒价格',
          key: 'boxPrice'
        }, {
          title: '餐盒数量',
          key: 'boxNum'
        }, {
          title: '商品描述',
          key: 'description'
        }, {
          title: '图片URL',
          key: 'picUrl'
        }
      ]
    }
  },
  methods: {
    handleClickOk () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
.modal-content-detail-update {
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
  }
}
</style>
