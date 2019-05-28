<template>
  <div class="process-progress">
    <Breadcrumb separator=">">
      <BreadcrumbItem v-if="isSingle" :to="listPathname"
        >商品管理</BreadcrumbItem
      >
      <BreadcrumbItem v-else :to="selectPoiCategoryPathname"
        >门店品类选择</BreadcrumbItem
      >
      <BreadcrumbItem>处理进度</BreadcrumbItem>
    </Breadcrumb>
    <div class="panel">
      <Button type="primary" @click="pageReload">刷新本页</Button>
      <div class="task-list-wrapper">
        <Icon
          v-show="loading"
          type="loading"
          size="18"
          class="demo-spin-icon-load"
        ></Icon>
        <TaskLists v-if="taskListToday.length" :list="taskListToday" />
        <TaskLists
          v-if="taskListYesterday.length"
          :list="taskListYesterday"
          time-type="昨天"
        />
        <TaskLists
          v-if="taskListEarlier.length"
          :list="taskListEarlier"
          time-type="更早"
        />
      </div>
      <div class="page-wrapper">
        <Page :total="totalNum" :page-size="30" />
      </div>
    </div>
  </div>
</template>

<script>
import TaskLists from "./components/TaskLists";
import { isSingle, poiId } from "../../common/constants";
import { formatTime } from "../../common/utils";
import { fetchTaskList } from "../../data/api/taskApi";

export default {
  name: "progress",
  components: {
    TaskLists
  },
  data() {
    return {
      isSingle: isSingle,
      poiId: poiId,
      listPathname: "/product/list",
      selectPoiCategoryPathname: "/reuse/product/router/page/multiPoiRouter",
      taskList: [],
      taskListToday: [],
      taskListYesterday: [],
      taskListEarlier: [],
      loading: false,
      pageNum: 1,
      pageSize: 30,
      totalNum: 0
    };
  },
  methods: {
    getTaskList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if (this.isSingle) {
        (params.wmPoiId = this.poiId), (params.targetWmPoiId = this.poiId);
      }
      return new Promise((resolve, reject) => {
        fetchTaskList(params)
          .then(res => {
            this.totalNum = res.totalSize;
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    changePage(num) {
      this.pageNum = num;
      this.loading = true;
      this.getTaskList()
        .then(data => {
          this.loading = false;
          this.taskList = data;
          this.sortTaskList(data);
        })
        .catch(err => {
          this.loading = false;
          this.$Message.error(err.message || err);
        });
    },

    sortTaskList(data) {
      data.forEach(d => {
        const t = formatTime(d.ctime);
        const obj = Object.assign({}, d, { timeText: t });
        if (t.includes("今天")) {
          this.taskListToday.push(obj);
        } else if (t.includes("昨天")) {
          this.taskListYesterday.push(obj);
        } else {
          this.taskListEarlier.push(obj);
        }
      });
    },

    pageReload() {
      window.location.reload();
    }
  },
  created() {
    this.changePage(this.pageNum);
  }
};
</script>

<style lang="less" scoped>
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
