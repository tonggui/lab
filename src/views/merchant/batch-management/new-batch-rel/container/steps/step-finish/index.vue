<template>
  <div class="step-finish-container">
    <Icon :local="isSuccess? 'success' : 'fail'" size="50"/>
    <div class="desc" v-html="highlight" />
    <Button v-if="isSuccess" @click="handleFinish">完成，返回商品列表</Button>
    <div v-else>
      <Button type="primary" @click="handleDownload" :style="{ 'margin-right': '16px' }">下载【失败商品&门店表】</Button>
      <Button @click="handleRelate">重新关联</Button>
    </div>
  </div>
</template>

<script>
  import { fetchBatchRelConfirm } from '@/data/repos/merchantPoi'
  import { BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'

  export default {
    name: 'step-rel',
    props: {
      status: {
        type: Number
      },
      resultDesc: String,
      resultUrl: String,
      checkRunningStatus: Function
    },
    computed: {
      isSuccess () {
        return this.status === BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS
      },
      highlight () {
        if (!this.resultDesc) return
        if (!this.isSuccess) return this.resultDesc
        const op = this.resultDesc.replace(/\d+/g, (match) => `<span style="color: #00BF7F">${match}</span>`)
        return op
      }
    },
    methods: {
      handleDownload () {
        location.href = this.resultUrl
      },
      handleRelate () {
        this.handleConfirm()
        this.checkRunningStatus()
      },
      async handleConfirm () {
        try {
          await fetchBatchRelConfirm()
        } catch (err) {
          console.log(err)
        }
      },
      handleFinish () {
        this.handleConfirm()
        this.goToList()
      },
      goToList () {
        this.$router.push({ name: 'merchantList' })
      }
    }
  }
</script>

<style lang="less" scoped>
  .step-finish-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 70px;
    .desc {
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #222222;
      text-align: center;
      margin: 30px 0 20px;
    }
  }
</style>
