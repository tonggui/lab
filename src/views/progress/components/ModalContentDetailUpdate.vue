<template>
  <div class="modal-content-detail-update">
    <Table border :data="list" :columns="columns" />
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
  </div>
</template>

<script>
import { MUT_MODE, MUT_MODE_STR, SELL_STATUS_STR } from '../constants'

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
          width: 100,
          render: (h, { row }) => {
            return h('span', MUT_MODE_STR[row.mode])
          }
        }, {
          title: '匹配条件',
          key: 'condition',
          minWidth: 100,
          maxWidth: 200,
          render: (h, { row }) => {
            return h('span', {
              domProps: {
                innerHTML: row.condition
              }
            })
          }
        }, {
          title: '商品名称',
          key: 'productName',
          width: 100
        }, {
          title: '库存',
          key: 'stock',
          width: 100
        }, {
          title: '价格',
          key: 'price',
          width: 100
        }, {
          title: '售卖状态',
          key: 'sellStatus',
          width: 100,
          render: (h, { row }) => {
            return h('span', SELL_STATUS_STR[row.sellStatus])
          }
        }, {
          title: '重量',
          key: 'weight',
          width: 100
        }, {
          title: '餐盒价格',
          key: 'boxPrice',
          width: 100
        }, {
          title: '餐盒数量',
          key: 'boxNum',
          width: 100
        }, {
          title: '商品描述',
          key: 'description',
          width: 100
        }, {
          title: '图片URL',
          key: 'picUrl',
          minWidth: 100
        }
      ]
    }
  },
  computed: {
    list () {
      const list = this.dataSource.data || []
      list.length && list.forEach(item => {
        const con = JSON.parse(item.condition)
        switch (con.ruleType) {
          case MUT_MODE.NAME:
            item.condition = `分类：${con.tagName || ''}<br>商品名称：${con.productName || ''}<br>规格：${con.specName || ''}`
            break
          case MUT_MODE.UPC:
            item.condition = con.upc
            break
          case MUT_MODE.SKU:
            item.condition = con.sku
        }
      })
      return list
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
