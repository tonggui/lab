<template>
  <div class="product-relate-container">
<!--    <Alert type="warning" class="product-relate-alert" closable v-if="unRelateNum">-->
<!--      <div class="left">-->
<!--        <Icon type="error" size="17" color="red" />&nbsp;-->
<!--        检测到有{{unRelateNum}}个总部商品未关联门店。需商品与分店建立关联，才可实现“总部商品修改、已建立关联分店的商品自动更新”。-->
<!--      </div>-->
<!--      <div class="right" slot="close">-->
<!--        <Button type="primary" @click="handleRelate">立即关联</Button>&nbsp;-->
<!--        <Icon type="closed-thin"></Icon>-->
<!--      </div>-->
<!--    </Alert>-->
    <Alert v-if="taskId !== -1 && isProcessing" type="warning" closable class="product-relate-result">
      <div class="left">
        <div class="title">任务进度</div>
        <div class="divider" />
        <div :class="{ 'desc': true, 'warning': true}">从分店导入商品</div>
        <div>于{{displayTime}}提交的导入任务正在进行中。请耐心等待</div>
      </div>
      <div class="right" slot="close">
        <Button type="primary" v-if="isProcessing" @click.stop="handleGoToTask">查看进度</Button>
      </div>
    </Alert>
    <Modal :value="visible" closable>
      <div slot="header">
        请将总部商品与分店关联
      </div>
      <div slot="default">
        总部商品与分店建⽴关联后，才可实现“总部商品修改后，已建⽴关联分店的商品⾃动更新”
      </div>
      <div slot="footer">
        <Button @click="visible = false">取消</Button>
        <Button type="primary" @click="handleRelate">立即关联</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { fetchGetRunningTaskStatus } from '@/data/repos/merchantProduct'
  import LocalStorage, { KEYS } from '@/common/local-storage'
  import moment from 'moment'
  import { BATCH_REL_TASK_STATUS, BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'
  import { jumpTo } from '@components/link'

  export default {
    name: 'product-relate',
    components: {},
    data () {
      return {
        visible: false,
        unRelateNum: 0,
        taskId: -1,
        ctime: 0,
        status: BATCH_REL_TASK_STATUS.INLINE
      }
    },
    computed: {
      displayTime () {
        return moment(this.ctime || 0).format('YYYY-MM-DD HH:mm:ss')
      },
      isProcessing () {
        return [BATCH_REL_TASK_STATUS.INLINE, BATCH_REL_TASK_STATUS.IN_PROCESS].includes(this.status)
      }
    },
    methods: {
      handleRelate () {
        this.$router.push({ name: 'newBatchRel' })
      },
      async getMerchantTaskStatus () {
        const { id, status, ctime, resultStatus } = await fetchGetRunningTaskStatus(2)
        this.taskId = id
        this.ctime = ctime
        this.status = status
        // 如果有失败任务，默认跳转到失败页面
        if (id > 0 && BATCH_REL_TASK_STATUS.FINISH === status && resultStatus !== BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS) {
          this.handleGoToTask()
        }
      },
      handleGoToTask () {
        jumpTo(`/reuse/sc/product/views/seller/center/productImport`)
      }
    },
    mounted () {
      if (LocalStorage[KEYS.MERCHANT_OPEN_STATUS] === false && !LocalStorage[KEYS.MERCHANT_WELCOME]) {
        this.$Message.success('欢迎使用，请尽快创建总部商品~')
        LocalStorage[KEYS.MERCHANT_WELCOME] = true
      }
      this.getMerchantTaskStatus()
    }
  }
</script>

<style lang="less" scoped>
  .product-relate-alert {
    display: flex;
    height: 50px;
    .left, .right {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .product-relate-result {
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
        width: 100px;
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
