<template>
  <div class="process-progress">
    <Breadcrumb separator=">">
      <BreadcrumbItem v-if="isSingle" :to="listPathname">商品管理</BreadcrumbItem>
      <BreadcrumbItem v-else :to="selectPoiCategoryPathname">门店品类选择</BreadcrumbItem>
      <BreadcrumbItem>处理进度</BreadcrumbItem>
    </Breadcrumb>
    <div class="panel">
      <Button type="primary" @click="pageReload">刷新本页</Button>
      <div class="task-list-wrapper">
        <Icon v-show="loading" type="loading" size="18" class="demo-spin-icon-load"></Icon>
        <template v-for="(list, index) in sortedTaskList">
          <TaskLists
            :key="index"
            v-if="list.length"
            :list="list"
            :time-type="getTimeType(index)"
            @opr-detail="oprDetail"
          />
        </template>
      </div>
      <div class="page-wrapper">
        <Page :total="totalNum" :page-size="30" />
      </div>
    </div>

    <!--查看详情Modal-->
    <Modal
      v-model="detailModal"
      :title="DETAIL_MODAL_TITLE[curType]"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div v-if="TYPE[curType] === 'SYNC'" v-html="detailSyncHtml"></div>
      <div v-else-if="TYPE[curType] === 'UPLOAD_IMGS'">
        <!--<Table :columns="imgDetailsColumns" :data="uploadImgDetails" border />-->
      </div>
      <div v-else>
        <!--<Table :columns="mutDetailsColumns" :data="detailMutations" border />-->
      </div>
    </Modal>
  </div>
</template>

<script>
import TaskLists from './components/TaskLists'
import { isSingle, poiId } from '../../common/constants'
import {
  TYPE,
  DETAIL_OPR,
  DETAIL_MODAL_TITLE,
  MUT_MODE_STR,
  SELL_STATUS_STR
} from './constants'
import { formatTime } from '../../common/utils'
import {
  fetchTaskList,
  fetchUploadImgsDetail,
  fetchTaskDetail
} from '../../data/repos/taskRepository'

export default {
  name: 'batch-progress',
  components: {
    TaskLists
  },
  data () {
    return {
      isSingle: isSingle,
      poiId: poiId,
      TYPE,
      DETAIL_OPR,
      DETAIL_MODAL_TITLE,
      MUT_MODE_STR,
      SELL_STATUS_STR,
      listPathname: '/product/list',
      selectPoiCategoryPathname: '/reuse/product/router/page/multiPoiRouter',
      taskList: [],
      sortedTaskList: [],
      loading: false,
      pageNum: 1,
      pageSize: 30,
      totalNum: 0,
      detailModal: false, // 查看详情弹窗
      curType: 2, // 当前操作任务类型
      curId: 0, // 当前操作任务id
      uploadImgDetails: [], // UPLOAD_IMGS的操作详情
      imgDetailsColumns: [
        {
          title: '匹配方式',
          key: 'nameTypeDesc'
        }, {
          title: '匹配内容',
          key: 'imgValue'
        }
      ],
      detailSyncHtml: '', // SYNC的操作详情
      detailMutations: [], // UPDATE、EXPORT、DELETE的操作详情
      mutDetailsColumns: [
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
    ok () {
      this.$Message.info('Clicked ok')
    },

    cancel () {
      this.$Message.info('Clicked cancel')
    },

    getTaskList () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.isSingle) {
        params.wmPoiId = this.poiId
        params.targetWmPoiId = this.poiId
      }
      return new Promise((resolve, reject) => {
        fetchTaskList(params)
          .then(res => {
            this.totalNum = res.totalSize
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    changePage (num) {
      this.pageNum = num
      this.loading = true
      this.getTaskList()
        .then(data => {
          this.loading = false
          this.taskList = data
          this.sortTaskList(data)
        })
        .catch(err => {
          this.loading = false
          this.$Message.error(err.message || err)
        })
    },

    sortTaskList (data) {
      const today = []
      const yesterday = []
      const earlier = []
      data.forEach(d => {
        const t = formatTime(d.ctime)
        const obj = Object.assign({}, d, { timeText: t })
        if (t.includes('今天')) {
          today.push(obj)
        } else if (t.includes('昨天')) {
          yesterday.push(obj)
        } else {
          earlier.push(obj)
        }
      })
      this.sortedTaskList.splice(0)
      this.sortedTaskList.push(today, yesterday, earlier)
    },

    pageReload () {
      window.location.reload()
    },

    getTimeType (index) {
      return index === 0 ? '今天' : (index === 1 ? '昨天' : '更早')
    },

    oprDetail (item) {
      this.curId = item.id
      this.curType = item.type
      if (DETAIL_OPR[item.type] === 'DOWNLOAD') {
        item.output && window.open(item.output)
      } else if (DETAIL_OPR[item.type] === 'VIEW') {
        if (TYPE[item.type] === 'UPLOAD_IMGS') {
          this.fetchUploadImgsDetail(item.id).then((data) => {
            this.uploadImgDetails = data
            this.detailModal = true
          }).catch(err => {
            this.$Message.error(err.message || err)
          })
        } else {
          this.fetchTaskDetail(item.id, item.type).then((data) => {
            if (item.type === 5) {
              this.detailSyncHtml = data
            } else {
              this.detailMutations = data
            }
            this.detailModal = true
          }).catch(err => {
            this.$Message.error(err.message || err)
          })
        }
      }
    },

    fetchUploadImgsDetail (taskId) {
      return new Promise((resolve, reject) => {
        fetchUploadImgsDetail(taskId).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    fetchTaskDetail (taskId, taskType) {
      return new Promise((resolve, reject) => {
        fetchTaskDetail(taskId).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  created () {
    this.changePage(this.pageNum)
  }
}
</script>

<style lang='less' scoped>
.process-progress {
  text-align: left;
  .panel {
    min-width: 1000px;
    min-height: 700px;
    padding: 30px;
    background-color: #fff;
    margin-top: 10px;
    .task-list-wrapper {
      margin-top: 30px;
    }
    .page-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
