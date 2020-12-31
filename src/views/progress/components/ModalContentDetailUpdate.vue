<template>
  <div class="modal-content-detail-update">
    <Table border :data="list" :columns="columns" />
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
  </div>
</template>

<script>
  import { convertTaskDetailCondition } from '../utils'
  import { MUT_MODE_STR, SELL_STATUS_STR } from '../constants'

  const EXTRA_COLS = [
    {
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

  export default {
    name: 'modal-content-detail-update',
    props: {
      dataSource: {
        type: Object,
        required: true
      },
      taskType: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        defaultColumns: [
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
              console.log('row.condition', row.condition)
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
          } ]
      }
    },
    computed: {
      columns () {
        return this.taskType === 'MEDICINE_DETAIL_UPDATE' ? this.defaultColumns : this.defaultColumns.concat(EXTRA_COLS)
      },
      list () {
        let list = this.dataSource.data || []
        if (list.length) {
          list = list.map(item => convertTaskDetailCondition(item))
        }
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
