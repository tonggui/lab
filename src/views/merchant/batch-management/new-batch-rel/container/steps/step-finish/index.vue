<template>
  <div class="step-finish-container">
    <Icon type="time" />
    <div>{{resultDesc}}</div>
    <Button v-if="isSuccess" @click="handleFinish">完成，返回商品列表</Button>
    <div v-else>
      <Button type="primary" @click="handleDownload">下载【失败商品&门店表】</Button>
      <Button @click="handleRelate">重新关联</Button>
    </div>
  </div>
</template>

<script>
  import { fetchBatchRelConfirm } from '@/data/repos/merchantPoi'
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
        return this.status === 1
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

  }
</style>
