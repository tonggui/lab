<template>
  <TaskProgressStatusBar :list="list" v-if="list.length" @on-click-btn="handleClickBtn"/>
</template>

<script>
  import { isFunction } from 'lodash'
  import { getCubeTaskStatus, getCubeTaskConfirm } from '@/data/repos/merchantCube'
  import BaseTaskProcess from '@/components/task-progress-status-bar/task-progress'
  import TaskProgressStatusBar from '@/components/task-progress-status-bar'

  export default {
    name: 'merchant-center-cube-notification',
    data () {
      return {
        list: []
      }
    },
    components: {
      TaskProgressStatusBar
    },
    methods: {
      handleClickBtn (task, button) {
        if (typeof button.link === 'string') {
          this.$router.push({ name: button.link || task.link || '' })
        } else if (isFunction(button.link)) {
          getCubeTaskConfirm(task.taskId).then(() => {
            this.list = []
          })
        }
      },
      async getTaskStatus () {
        const { taskId, taskName, status, submitTime, processResult: { resultStatus = '' } } = await getCubeTaskStatus()
        if (taskId <= 0) return
        const list = [...this.list]
        list.push(new BaseTaskProcess({ link: 'merchantCubeList', name: '魔方快捷创建', taskId, taskName: '魔方商品任务' || taskName, status, submitTime, resultStatus }))
        this.list = list
      }
    },
    mounted () {
      this.getTaskStatus()
    }
  }
</script>

<style lang="less" scoped>

</style>
