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
      aaaaaaa
    </Modal>
  </div>
</template>

<script>
import TaskLists from './components/TaskLists'
import { isSingle, poiId } from '../../common/constants'
import { DETAIL_OPR, DETAIL_MODAL_TITLE } from './constants'
import { formatTime } from '../../common/utils'
import {
  fetchTaskList,
  fetchUploadImgsDetail,
  fetchTaskDetail
} from '../../data/repos/taskRepository'

export default {
  name: 'progress',
  components: {
    TaskLists
  },
  data () {
    return {
      isSingle: isSingle,
      poiId: poiId,
      DETAIL_OPR,
      DETAIL_MODAL_TITLE,
      listPathname: '/product/list',
      selectPoiCategoryPathname: '/reuse/product/router/page/multiPoiRouter',
      taskList: [],
      sortedTaskList: [],
      taskListToday: [],
      taskListYesterday: [],
      taskListEarlier: [],
      loading: false,
      pageNum: 1,
      pageSize: 30,
      totalNum: 0,
      detailModal: false, // 查看详情弹窗
      curType: 2, // 当前操作任务类型
      curId: 0, // 当前操作任务id
      uploadImgDetails: [],
      detailSyncHtml: ''
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
        this.detailModal = true
      }
    },

    fetchUploadImgsDetail (taskId) {
      return new Promise((resolve, reject) => {
        fetchUploadImgsDetail(taskId).then(data => {
          this.uploadImgDetails = data
        })
      })
    },

    fetchTaskDetail (taskId, taskType) {
      return new Promise((resolve, reject) => {
        fetchTaskDetail(taskId).then(data => {
          if (taskType === 5) {
            this.detailSyncHtml = data
          } else {
            this.detailMutations = data
          }
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
