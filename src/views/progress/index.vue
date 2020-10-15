<template>
  <div class="process-progress">
    <BreadcrumbHeader v-if="platform === PLATFORM.MERCHANT">处理进度</BreadcrumbHeader>
    <Breadcrumb separator=">" v-if="platform === PLATFORM.PRODUCT && !isSingleCategoryPoi">
      <BreadcrumbItem v-if="isSingle">
        <span class="multi-poi-bread" @click="goBack">&lt; 返回</span>
      </BreadcrumbItem>
      <template v-else>
        <BreadcrumbItem>
          <span class="multi-poi-bread" @click="handleClickMultiPoi">门店品类选择</span>
        </BreadcrumbItem>
        <BreadcrumbItem>处理进度</BreadcrumbItem>
      </template>
    </Breadcrumb>
    <div class="panel">
      <Button type="primary" @click="pageReload">刷新本页</Button>
      <div class="task-list-wrapper">
        <div v-if="!loading && taskList && !taskList.length" class="list-empty">
          <Empty />
        </div>
        <Loading v-show="loading" />
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
      <div class="page-wrapper" v-if="taskList && taskList.length">
        <Page :total="total" :page-size="pageSize" @on-change="changePage" />
      </div>
    </div>

    <!--查看目标门店、查看操作详情、查看异常汇总-->
    <Modal
      v-model="checkModal"
      :title="checkModalTitle"
      footer-hide
      :width="checkModalType === 'DETAIL_UPDATE' ? 1000 : 520"
      @on-cancel="onCancel"
    >
      <ContentPoi v-if="checkModalType === 'POI'" :data-source="checkModalData" :task-type="curTaskType" @close="cancel" />
      <DetailUpdate v-if="checkModalType === 'DETAIL_UPDATE'" :data-source="checkModalData" @close="cancel"/>
      <DetailCommon v-if="checkModalType === 'DETAIL_COMMON'" :data-source="checkModalData" :task-type="curTaskType" @close="cancel"/>
      <DetailUploadImgs v-if="checkModalType === 'DETAIL_UPLOAD_IMGS'" :data-source="checkModalData" @close="cancel"/>
      <Exception v-if="checkModalType === 'EXCEPTION'" :data-source="checkModalData" @close="cancel" />
      <Merchant
        v-if="checkModalType === 'EXCEPTION_MERCHANT' || checkModalType === 'DETAIL_MERCHANT' || checkModalType === 'DOWNLOAD_DELETE_MERCHANT'"
        :data-source="checkModalData"
        @close="cancel"
      />
    </Modal>
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import productList from '@sgfe/eproduct/navigator/pages/product/list'
  import TaskLists from './components/TaskLists'
  import ContentPoi from './components/ModalContentPoi'
  import DetailUpdate from './components/ModalContentDetailUpdate'
  import DetailCommon from './components/ModalContentDetailCommon'
  import DetailUploadImgs from './components/ModalContentDetailUploadImgs'
  import Exception from './components/ModalContentException'
  import Merchant from './components/ModalContentMerchant'
  import jumpTo from '@/components/link/jumpTo'
  import { getIsSingle, getPoiId, getRouterTagId } from '@/common/constants'
  import {
    STATUS,
    STATUS_STR,
    RESULT,
    TYPE,
    TYPE_OPR_STR,
    DETAIL_ACTION,
    DETAIL_METHOD,
    STATUS_SUCCESS_RESULT,
    STATUS_FAIL_RESULT,
    MUT_MODE_STR,
    SELL_STATUS_STR,
    MERCHANT_STATUS
  } from './constants'
  import { PLATFORM } from '@/data/enums/common'
  import {
    fetchTaskList,
    fetchTaskPois,
    fetchTaskDetail,
    fetchTaskMessage
  } from '@/data/repos/taskRepository'
  import { fetchGetMultiPoiIsSingleTag } from '@/data/repos/poi'

  export default {
    name: 'batch-progress',
    components: {
      BreadcrumbHeader,
      TaskLists,
      ContentPoi,
      DetailUpdate,
      DetailCommon,
      DetailUploadImgs,
      Exception,
      Merchant
    },
    data () {
      return {
        PLATFORM,
        PRODUCT_LIST_PAGE_NAME: productList.name,
        isSingleCategoryPoi: false, // 是否是单品类商户
        STATUS,
        STATUS_STR,
        RESULT,
        TYPE,
        TYPE_OPR_STR,
        DETAIL_ACTION,
        DETAIL_METHOD,
        STATUS_SUCCESS_RESULT,
        STATUS_FAIL_RESULT,
        MUT_MODE_STR,
        SELL_STATUS_STR,
        MERCHANT_STATUS,
        taskList: [],
        sortedTaskList: [],
        loading: false,
        pageNum: 1,
        pageSize: 30,
        total: 0,
        curTaskType: 1, // 当前点击按钮查看、操作的任务类型，在src/views/progress/constants.js中可以看到所有类型值
        checkModal: false, // 查看目标门店、查看操作详情、查看异常汇总 弹窗
        checkModalTitle: '',
        checkModalType: '', // 类型值有：'POI', 'DETAIL_UPDATE', 'DETAIL_COMMON', 'DETAIL_UPLOAD_IMGS', 'EXCEPTION'
        checkModalData: {}
      }
    },
    computed: {
      isSingle () {
        return getIsSingle()
      },
      poiId () {
        return getPoiId()
      },
      routerTagId () { // 批量操作品类
        return getRouterTagId()
      },
      platform () {
        return this.$route.meta.platform
      },
      productListPageParams () {
        return {
          wmPoiId: this.poiId,
          from: 'single'
        }
      },
      selectPoiCategoryPathname () {
        return `/reuse/product/router/page/multiPoiRouter`
      }
    },
    methods: {
      cancel () {
        this.checkModal = false
        this.checkModalData = {} // 恢复初始值
      },

      onCancel () {
        this.checkModalData = {} // ESC关闭恢复初始值
      },

      getRouterInfo () {
        fetchGetMultiPoiIsSingleTag(this.routerTagId).then(data => {
          this.isSingleCategoryPoi = data
        })
      },

      handleClickMultiPoi () {
        jumpTo(this.selectPoiCategoryPathname)
      },

      getTaskList () {
        const params = {
          platform: this.platform,
          current: this.pageNum,
          pageSize: this.pageSize
        }
        if (this.isSingle) {
          params.wmPoiId = this.poiId
          params.targetWmPoiId = this.poiId
        }
        return new Promise((resolve, reject) => {
          fetchTaskList(params)
            .then(res => {
              this.total = res.pagination.total
              resolve(res.list)
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

      convertStatusToTexts (status, param1, param2) {
        const statusTexts = [] // 第一个元素放颜色为黄色的结果，第二个放绿色，第三个放红色
        if (this.platform === PLATFORM.MERCHANT) {
          switch (status) {
          case MERCHANT_STATUS.PENDING:
            statusTexts.push('待处理', '', '')
            break
          case MERCHANT_STATUS.DOING:
          case MERCHANT_STATUS.DOING_PART_FAIL:
            statusTexts.push(`处理中（已完成${param1}%）`, '', '')
            break
          case MERCHANT_STATUS.PART_SUCCESS:
            statusTexts.push('', `成功：${param1}`, `失败：${param2}`)
            break
          case MERCHANT_STATUS.SUCCESS:
            statusTexts.push('', '全部成功', '')
            break
          case MERCHANT_STATUS.FAIL:
            statusTexts.push('', '', `全部失败：${param1}`)
            break
          case MERCHANT_STATUS.INTERRUPTED:
            statusTexts.push('', '', `已中断（已完成${param1}%）`)
            break
          default:
            break
          }
        } else {
          const str = STATUS_STR[status]
          switch (status) {
          case STATUS.DOING:
            statusTexts.push(str, '', '')
            break
          case STATUS.COMPLETE:
            statusTexts.push('', str, '')
            break
          case STATUS.FAIL:
            statusTexts.push('', '', str)
            break
          default:
            break
          }
        }
        return statusTexts
      },

      renderActions (id, type, status, result, outputListUrl) {
        const actions = []
        if (this.platform === PLATFORM.MERCHANT) { // 商家商品中心的部分
          if (status === MERCHANT_STATUS.PART_SUCCESS || status === MERCHANT_STATUS.FAIL || status === MERCHANT_STATUS.INTERRUPTED || status === MERCHANT_STATUS.DOING_PART_FAIL) {
            actions.push({
              title: '查看异常汇总',
              actionType: 'MODAL',
              btnType: 'primary',
              method: {
                title: '查看异常汇总',
                modalType: 'EXCEPTION_MERCHANT',
                getData: () => this.getTaskMessage(id)
              }
            })
          }
          actions.push({
            title: '查看详情',
            actionType: 'MODAL',
            disabled: status === MERCHANT_STATUS.PENDING,
            method: {
              title: '查看详情',
              modalType: 'DETAIL_MERCHANT',
              getData: () => this.getTaskDetail(id)
            }
          })
        } else { // 商品管理的部分
          if (!this.isSingle) {
            actions.push({
              title: '查看目标门店',
              actionType: 'MODAL',
              method: {
                title: '查看目标门店',
                modalType: 'POI',
                getData: () => this.getTaskPois(id)
              }
            })
          }
          actions.push({
            title: TYPE_OPR_STR[type],
            actionType: DETAIL_ACTION[type],
            method: DETAIL_METHOD[type] === 'output' ? 'output' : Object.assign({}, DETAIL_METHOD[type], { getData: () => this.getTaskDetail(id, type) })
          })
          if (status === STATUS.COMPLETE) {
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
            if (outputListUrl) {
              actions.push({
                title: STATUS_SUCCESS_RESULT[type],
                actionType: 'MODAL',
                method: {
                  title: '下载被删除商品',
                  modalType: 'DOWNLOAD_DELETE_MERCHANT',
                  getData: async () => ({ extraLink: outputListUrl })
                }
              })
            } else {
              actions.push({
                title: STATUS_SUCCESS_RESULT[type],
                actionType: 'LINK',
                method: 'output'
              })
            }
          } else if (status === STATUS.FAIL) {
            actions.push({
              title: STATUS_FAIL_RESULT[type],
              actionType: 'TEXT',
              method: {}
            })
          }
        }
        return actions
      },

      sortTaskList (data) {
        const today = []
        const yesterday = []
        const earlier = []
        data.forEach(d => {
          const {
            id, type, status, result, time, statusParam1, statusParam2, outputListUrl
          } = d
          const statusTexts = this.convertStatusToTexts(status, statusParam1, statusParam2)
          const actions = this.renderActions(id, type, status, result, outputListUrl)
          const obj = Object.assign({}, d, { statusTexts, actions })

          if (time.includes('今天')) {
            today.push(obj)
          } else if (time.includes('昨天')) {
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

      getTaskDetail (taskId, taskType = undefined) {
        return new Promise((resolve, reject) => {
          fetchTaskDetail(this.platform, taskId, taskType).then(data => {
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
      },

      getTaskMessage (taskId) {
        return new Promise((resolve, reject) => {
          fetchTaskMessage(this.platform, taskId).then(data => {
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      goBack () {
        this.$router.back()
      }
    },
    created () {
      if (this.platform === PLATFORM.PRODUCT && !this.isSingle) {
        this.getRouterInfo()
      }
      this.changePage(this.pageNum)
    }
  }
</script>

<style lang='less' scoped>
.process-progress {
  text-align: left;
  .multi-poi-bread {
    color: @primary-color;
    cursor: pointer;
    &:hover {
      color: #656778;
    }
  }
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
      .list-empty {
        padding-top: 200px;
      }
    }
    .page-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
