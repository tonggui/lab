<template>
  <div class="modal-content-detail-common">
    <div v-if="TYPE['SYNC'] === Number(taskType)" v-html="dataSource.detailSyncHtml"></div>
    <Table v-else border :data="list" :columns="columns" />
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
  </div>
</template>

<script>
import { convertTaskDetailCondition } from '../utils'
import { TYPE, MUT_MODE_STR } from '../constants'

export default {
  name: 'modal-content-detail-common',
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
          title: '匹配方式',
          key: 'mode',
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
        }
      ]
    }
  },
  computed: {
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
.modal-content-detail-common {
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
  }
}
</style>
