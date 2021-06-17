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
      checkRunningStatus: Function,
      poiCount: Number,
      productCount: Number
    },
    computed: {
      isSuccess () {
        return this.status === BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS
      },
      highlight () {
        if (this.isSuccess) {
          return `全部成功，共<span style="color: #00BF7F">${this.productCount || 0}</span>个商品，成功关联到<span style="color: #00BF7F">${this.poiCount || 0}</span>个门店`
        } else {
          return '部分关联失败，详细请下载表格文件'
        }
      }
    },
    methods: {
      handleDownload () {
        if (!this.resultUrl) return
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
