<template>
  <div class="process-progress">
    <Breadcrumb separator=">" v-if="platform === PLATFORM.MERCHANT || platform === PLATFORM.MULTI_STORE_MANAGEMENT">
      <BreadcrumbItem>
        <span class="multi-poi-bread" @click="goBack">&lt; 返回</span>
      </BreadcrumbItem>
    </Breadcrumb>
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
        <template v-for="(list, index) in displaySortedTaskList">
          <TaskList
            :key="index"
            v-if="list.length"
            :list="list"
            :time-type="getTimeType(index)"
          />
        </template>
      </div>
      <div class="page-wrapper" v-if="taskList && taskList.length">
        <Page :total="total" :page-size="pageSize" @on-change="changePage" />
      </div>
    </div>
  </div>
</template>

<script>
  import productList from '@sgfe/eproduct/navigator/pages/product/list'
  import TaskList from './task-list'
  import jumpTo from '@/components/link/jumpTo'
  import { getIsSingle, getPoiId, getRouterTagId } from '@/common/constants'
  import { PLATFORM } from '@/data/enums/common'
  import { ProgressTask } from '@/views/progress-new/models/progress-task'
  import { MultiPoiProgressTask } from '@/views/progress-new/models/multi-poi-progress-task'
  import createMerchantTaskViewModel from '@/views/progress-new/models/merchant/factory'
  import {
    fetchTaskList
  } from '@/data/repos/taskRepository'
  import { fetchGetMultiPoiIsSingleTag } from '@/data/repos/poi'

  export default {
    name: 'NewProgressList',
    components: {
      TaskList
    },
    data () {
      return {
        PLATFORM,
        PRODUCT_LIST_PAGE_NAME: productList.name,
        isSingleCategoryPoi: false, // 是否是单品类商户
        taskList: [],
        loading: false,
        pageNum: 1,
        pageSize: 30,
        total: 0
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
      },
      displaySortedTaskList () {
        const sectionSortTaskList = this.sortTaskList(this.taskList)
        if (this.platform === PLATFORM.MERCHANT) {
          return sectionSortTaskList.map(list => list.map(task => createMerchantTaskViewModel(task)))
        } else {
          let TaskViewModelWrapper = ProgressTask
          if (!this.isSingle) {
            TaskViewModelWrapper = MultiPoiProgressTask
          }
          return sectionSortTaskList.map(list => list.map(task => new TaskViewModelWrapper(task)))
        }
      }
    },
    methods: {
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
          })
          .catch(err => {
            this.loading = false
            this.$Message.error(err.message || err)
          })
      },
      sortTaskList (taskList) {
        const today = []
        const yesterday = []
        const earlier = []
        taskList.forEach(task => {
          const { time } = task
          if (time.includes('今天')) {
            today.push(task)
          } else if (time.includes('昨天')) {
            yesterday.push(task)
          } else {
            earlier.push(task)
          }
        })
        return [today, yesterday, earlier]
      },
      pageReload () {
        window.location.reload()
      },
      getTimeType (index) {
        return index === 0 ? '今天' : (index === 1 ? '昨天' : '更早')
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
