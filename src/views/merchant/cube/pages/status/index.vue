<template>
  <div class="cube-status-container">
    <ProcessStatus
      :status="status"
      :process-text="processText"
      :succeed-num="succeedNum"
      :total-num="totalNum"
      :checkRunningStatus="getRunningStatusStatus"
      inline-text="抱歉，创建商品任务排队中，您可以先去处理其他事情~"
      tip="马上创建完毕，请您耐心等待~"
      inline-btn-text="返回'商品库'"
      not-inline-btn-text="返回'商品库'"
      @on-click-btn="handleClickBtn"
    />
  </div>
</template>

<script>
  import ProcessStatus from '@/components/process-status'
  import { getCubeTaskStatus } from '@/data/repos/merchantCube'
  import { BATCH_REL_TASK_STATUS } from '@/data/enums/batch'

  const RUNNING_STATUS = {
    'PRODUCT_CREATE': 201,
    'POI_ASYNC': 202
  }

  export default {
    name: 'status',
    data () {
      return {
        status: BATCH_REL_TASK_STATUS.INLINE,
        succeedNum: 0,
        totalNum: 0,
        processText: ''
      }
    },
    components: {
      ProcessStatus
    },
    methods: {
      async getRunningStatusStatus () {
        const { taskId, status, processStatus } = await getCubeTaskStatus()
        const {
          runningStatus = 201,
          mainStatus,
          poiStatus
        } = processStatus || {}
        this.status = status

        if (taskId <= 0) this.$router.push({ name: 'merchantCubeList' })
        if (status === BATCH_REL_TASK_STATUS.FINISH) this.$router.push({ name: 'merchantCubeProcessResult' })

        if (runningStatus === RUNNING_STATUS.PRODUCT_CREATE) {
          this.succeedNum = mainStatus.succeedNum
          this.totalNum = mainStatus.totalNum
          this.processText = `已创建${mainStatus.succeedNum}个商品/共${mainStatus.totalNum}个`
        } else {
          this.succeedNum = poiStatus.succeedNum
          this.totalNum = poiStatus.totalNum
          this.processText = `已关联${poiStatus.succeedNum}个门店/共${poiStatus.totalNum}个`
        }
      },
      handleClickBtn () {
        this.$router.push({ name: 'merchantList' })
      }
    },
    mounted () {
      this.getRunningStatusStatus()
    }
  }
</script>

<style lang="less" scoped>
  .cube-status-container {
    background: #fff;
    height: 100%;
  }
</style>
