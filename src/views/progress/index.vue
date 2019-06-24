<template>
  <div class="process-progress">
    <Breadcrumb separator=">" v-if="!routerTagInfo.singlePoiTagFlag">
      <BreadcrumbItem v-if="isSingle">
        <NamedLink :name="PRODUCT_LIST_PAGE_NAME" :query="productListPageParams">商品管理</NamedLink>
      </BreadcrumbItem>
      <BreadcrumbItem v-else>
        <Link :to="selectPoiCategoryPathname">门店品类选择</Link>
      </BreadcrumbItem>
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
            @handle-action="handleAction"
          />
        </template>
      </div>
      <div class="page-wrapper">
        <Page :total="totalNum" :page-size="30" />
      </div>
    </div>

    <!--查看目标门店、查看操作详情、查看异常汇总-->
    <Modal
      v-model="checkModal"
      :title="checkModalTitle"
      footer-hide
      :width="checkModalType === 'DETAIL_UPDATE' ? 1000 : 520"
    >
      <ContentPoi v-if="checkModalType === 'POI'" :data-source="checkModalData" :task-type="curTaskType" @close="cancel" />
      <DetailUpdate v-if="checkModalType === 'DETAIL_UPDATE'" :data-source="checkModalData" @close="cancel"/>
      <DetailCommon v-if="checkModalType === 'DETAIL_COMMON'" :data-source="checkModalData" :task-type="curTaskType" @close="cancel"/>
      <DetailUploadImgs v-if="checkModalType === 'DETAIL_UPLOAD_IMGS'" :data-source="checkModalData" @close="cancel"/>
      <Exception v-if="checkModalType === 'EXCEPTION'" :data-source="checkModalData" @close="cancel" />
    </Modal>
  </div>
</template>

<script>
import productList from '@sgfe/eproduct/navigator/pages/product/list'
import NamedLink from '@/components/link/named-link'
import Link from '@/components/link/link'
import TaskLists from './components/TaskLists'
import ContentPoi from './components/ModalContentPoi'
import DetailUpdate from './components/ModalContentDetailUpdate'
import DetailCommon from './components/ModalContentDetailCommon'
import DetailUploadImgs from './components/ModalContentDetailUploadImgs'
import Exception from './components/ModalContentException'
import { isSingle, poiId, routerTagId } from '@/common/constants'
import {
  STATUS,
  RESULT,
  TYPE,
  TYPE_OPR_STR,
  DETAIL_ACTION,
  DETAIL_METHOD,
  STATUS_SUCCESS_RESULT,
  STATUS_FAIL_RESULT,
  MUT_MODE_STR,
  SELL_STATUS_STR
} from './constants'
import { formatTime } from '@/common/utils'
import {
  fetchTaskList,
  fetchTaskPois,
  fetchTaskDetail,
  fetchTaskMessage
} from '@/data/repos/taskRepository'
import { fetchRouterInfo } from '@/data/repos/batchRepository'

export default {
  name: 'batch-progress',
  components: {
    NamedLink,
    Link,
    TaskLists,
    ContentPoi,
    DetailUpdate,
    DetailCommon,
    DetailUploadImgs,
    Exception
  },
  data () {
    return {
      PRODUCT_LIST_PAGE_NAME: productList.name,
      isSingle: isSingle,
      poiId: poiId,
      routerTagInfo: { // 批量操作品类数据
        singlePoiTagFlag: false, // 是否是单品类商户
        name: '',
        tagIds: '',
        id: routerTagId
      },
      STATUS,
      RESULT,
      TYPE,
      TYPE_OPR_STR,
      DETAIL_ACTION,
      DETAIL_METHOD,
      STATUS_SUCCESS_RESULT,
      STATUS_FAIL_RESULT,
      MUT_MODE_STR,
      SELL_STATUS_STR,
      taskList: [],
      sortedTaskList: [],
      loading: false,
      pageNum: 1,
      pageSize: 30,
      totalNum: 0,
      curTaskType: 1, // 当前点击按钮查看、操作的任务类型，在src/views/progress/constants.js中可以看到所有类型值
      checkModal: false, // 查看目标门店、查看操作详情、查看异常汇总 弹窗
      checkModalTitle: '',
      checkModalType: '', // 类型值有：'POI', 'DETAIL_UPDATE', 'DETAIL_COMMON', 'DETAIL_UPLOAD_IMGS', 'EXCEPTION'
      checkModalData: {}
    }
  },
  computed: {
    productListPageParams () {
      return {
        wmPoiId: this.poiId,
        from: 'single'
      }
    },
    selectPoiCategoryPathname () {
      return `/reuse/product/router/page/multiPoiRouter?routerTagId=${this.routerTagInfo.id}`
    }
  },
  methods: {
    cancel () {
      this.checkModal = false
    },

    getRouterInfo () {
      fetchRouterInfo({
        routerTagId: this.routerTagInfo.id
      }).then(data => {
        this.routerTagInfo = Object.assign({}, this.routerTagInfo, data)
      })
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

    renderActions (id, type, status, result) {
      const actions = []
      if (!this.isSingle) {
        actions.push({
          title: '查看目标门店',
          actionType: 'MODAL',
          method: {
            title: '查看目标门店',
            modalType: 'POI',
            getData: () => this.getTaskPois(id, type)
          }
        })
      }
      actions.push({
        title: TYPE_OPR_STR[type],
        actionType: DETAIL_ACTION[type],
        method: Object.assign({}, DETAIL_METHOD[type], { getData: () => this.getTaskDetail(id, type) })
      })
      if (status === STATUS.SUCCESS) {
        if (result !== RESULT.SUCCESS) {
          actions.push({
            title: '查看异常汇总',
            actionType: 'MODAL',
            method: {
              title: '查看异常详情',
              modalType: 'EXCEPTION',
              getData: () => this.getTaskMessage(id)
            }
          })
        }
        actions.push({
          title: STATUS_SUCCESS_RESULT[type],
          actionType: 'LINK',
          method: 'output'
        })
      } else if (status === STATUS.FAIL) {
        actions.push({
          title: STATUS_FAIL_RESULT[type],
          actionType: 'TEXT',
          method: {}
        })
      }
      return actions
    },

    sortTaskList (data) {
      const today = []
      const yesterday = []
      const earlier = []
      data.forEach(d => {
        const {
          id, type, status, result, ctime
        } = d
        const t = formatTime(ctime)

        const actions = this.renderActions(id, type, status, result)

        const obj = Object.assign({}, d, { timeText: t, actions })
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

    handleAction (action, item) {
      const { actionType, method } = action
      const { type, output = '' } = item
      this.curTaskType = type
      if (actionType === 'LINK') {
        output && window.open(output)
      }
      if (actionType === 'MODAL') {
        const { title, modalType } = method
        this.checkModalTitle = title
        this.checkModalType = modalType
        method.getData().then(data => {
          this.checkModalData = data
          this.checkModal = true
        }).catch(err => {
          this.$Message.error(err.message || err)
        })
      }
    },

    getTaskPois (taskId) {
      return new Promise((resolve, reject) => {
        fetchTaskPois(taskId).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getTaskDetail (taskId, taskType) {
      return new Promise((resolve, reject) => {
        fetchTaskDetail(taskId, taskType).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getTaskMessage (taskId) {
      return new Promise((resolve, reject) => {
        fetchTaskMessage(taskId).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  created () {
    this.getRouterInfo()
    this.changePage(this.pageNum)
  }
}
</script>

<style lang='less' scoped>
.process-progress {
  text-align: left;
  .link {
    font-size: 14px;
    padding: 0;
    vertical-align: bottom;
    border: none;
  }
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
