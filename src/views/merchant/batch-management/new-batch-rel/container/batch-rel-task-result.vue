<template>
  <Alert v-if="show && taskId !== -1" type="warning" closable class="batch-rel-task-result-container">
    <div class="left">
      <div class="title">任务进度</div>
      <div class="divider" />
      <div :class="{ 'desc': true, 'warning': isProcessing || isAllSuccess, 'danger': isAllFail || isPartSuccess }">批量关联</div>
      <div>于{{displayTime}}提交的{{taskName}}任务{{displayText}}</div>
    </div>
    <div class="right" slot="close">
      <Button type="primary" v-if="isProcessing" @click.stop="handleGoToTask">查看进度</Button>
      <Button type="primary" v-else @click.stop="handleGoToTask">查看详情</Button>
      <a class="confirm" @click.stop="handleClose" v-if="isAllSuccess">我知道了</a>
    </div>
  </Alert>
</template>

<script>
  import { fetchGetRunningTask } from '@/data/repos/merchantPoi'
  import { BATCH_REL_TASK_STATUS, BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'

  export default {
    name: 'batch-rel-task-result',
    data () {
      return {
        show: true,
        ctime: 0,
        status: BATCH_REL_TASK_STATUS.INLINE,
        taskName: '',
        resultStatus: 0,
        taskId: -1
      }
    },
    computed: {
      displayTime () {
        return this.time
      },
      isProcessing () {
        return this.status !== BATCH_REL_TASK_STATUS.FINISH
      },
      isAllSuccess () {
        return this.status === BATCH_REL_TASK_STATUS.FINISH && this.resultStatus === BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS
      },
      isPartSuccess () {
        return this.status === BATCH_REL_TASK_STATUS.FINISH && this.resultStatus === BATCH_REL_TASK_RESULT_STATUS.PART_SUCCESS
      },
      isAllFail () {
        return this.status === BATCH_REL_TASK_STATUS.FINISH && this.resultStatus === BATCH_REL_TASK_RESULT_STATUS.FAIL
      },
      displayText () {
        if (this.isProcessing) {
          return '正在处理中，请耐心等待。'
        } else if (this.isAllSuccess) {
          return '已处理完成，已全部关联成功。'
        } else if (this.isPartSuccess) {
          return '已处理完成，部分关联失败，请查看并处理。'
        } else if (this.isAllFail) {
          return '已处理完成，全部关联失败，请查看并处理。'
        }
        return ''
      }
    },
    methods: {
      handleClose () {
        this.show = false
      },
      handleGoToTask () {
        this.$router.push({ name: 'newBatchRel' })
      },
      async getRunningStatus () {
        const { taskId, status, taskName, ctime, resultStatus } = await fetchGetRunningTask()
        this.taskId = taskId
        this.ctime = ctime
        this.taskName = taskName
        this.status = status
        this.resultStatus = resultStatus
      }
    },
    mounted () {
      this.getRunningStatus()
    }
  }
</script>

<style lang="less" scoped>
  .batch-rel-task-result-container {
    display: flex;
    height: 50px;
    align-items: center;
    .left, .right {
      display: flex;
      align-items: center;
    }
    .title {
      font-weight: 600;
    }
    .divider {
      width: 1px;
      height: 12px;
      background: #ccc;
      margin: 0 10px;
    }
    .left {
      .desc {
        padding: 0 5px;
        width: 60px;
        height: 18px;
        line-height: 18px;
        margin-right: 10px;
        font-size: 12px;
        border-radius: 2px;
        &.warning {
          border: 1px solid #F89A05;
          color: #F89A05;
        }
        &.danger {
          border: 1px solid #F5363F;
          color: #F5363F;
        }
      }
    }
    .right {
      .confirm {
        margin-left: 10px;
      }
    }
  }
</style>
