<template>
  <div class="steps-container">
    <Steps :current="stepNum" :list="list"/>
    <StepProduct
      v-if="stepNum === steps['PRODUCT']"
      :data="data"
      @step-change="handleStepJump"
      @data-change="handleDataChange"
    />
    <StepPoi
      v-else-if="stepNum === steps['POI']"
      :data="data"
      @batch-rel="handleRelate"
      @step-change="handleStepJump"
      @data-change="handleDataChange"
    />
    <StepRel
      :status="status"
      :poiCount="poiCount"
      :poiTaskDoneCount="poiTaskDoneCount"
      :checkRunningStatus="checkRunningStatus"
      v-else-if="stepNum === steps['RELATE']"
    />
    <StepFinish
      :status="resultStatus"
      :result-url="resultUrl"
      :result-desc="resultDesc"
      :poiCount="poiCount"
      :productCount="productCount"
      :checkRunningStatus="checkRunningStatus"
      v-else-if="stepNum === steps['FINISH']"
    />
  </div>
</template>

<script>
  import Steps from '@/components/steps'
  import StepProduct from './step-product/index'
  import StepPoi from './step-poi/index'
  import StepRel from './step-rel'
  import StepFinish from './step-finish'
  import { productInitValue } from './step-product/step-product-config'
  import { poiInitValue } from './step-poi/step-poi-config'
  import lx from '@/common/lx/lxReport'
  import { fetchGetRunningTask, fetchSubmitNewBatchRel } from '@/data/repos/merchantPoi'
  import { BATCH_REL_TASK_STATUS } from '@/data/enums/batch'
  import { STEPS, transferDataToServer } from './steps'
  import { cloneDeep } from 'lodash'
  import { uuid } from '@utiljs/guid'

  export default {
    name: 'steps',
    data () {
      return {
        steps: STEPS,
        status: BATCH_REL_TASK_STATUS.INLINE,
        poiCount: 0,
        poiTaskDoneCount: 0,
        resultStatus: 1,
        resultUrl: '',
        resultDesc: '',
        productCount: 0,
        data: cloneDeep(Object.assign({}, productInitValue, poiInitValue)),
        stepNum: STEPS['PRODUCT'],
        list: [{ id: 0, title: '选择商品与关联信息' }, { id: 1, title: '选择门店' }, { id: 2, title: '关联中' }, { id: 3, title: '关联完成' }]
      }
    },
    components: {
      Steps,
      StepProduct,
      StepPoi,
      StepRel,
      StepFinish
    },
    methods: {
      handleDataChange (key, value) {
        this.$set(this.data, key, value)
      },
      async handleRelate (cb) {
        {
          let bid = ''
          if (this.data.dataSourceType === 'all') bid = 'b_shangou_online_e_eq2cihrj_mc'
          else if (this.data.productSelect === 'category') bid = 'b_shangou_online_e_becff2vt_mc'
          else bid = 'b_shangou_online_e_6ka0nfmg_mc'
          lx.mc({
            bid
          })
        }

        try {
          const { wmPoiIds, ...left } = transferDataToServer(this.data)
          const traceId = uuid()
          lx.mc({
            bid: 'b_shangou_online_e_y80tyqr3_mc',
            val: {
              select_time: new Date().getTime(),
              trace_id: traceId
            }
          })
          await fetchSubmitNewBatchRel(wmPoiIds, left, traceId)
          this.data = cloneDeep(Object.assign({}, productInitValue, poiInitValue))
          cb()
          await this.checkRunningStatus()
        } catch (err) {
          this.$Message.error(err.message || '关联失败')
        }
      },
      handleStepJump (id, direction) {
        const STEP_NAMES = Object.keys(STEPS)
        const idx = STEP_NAMES.indexOf(id)
        switch (direction) {
        case 'previous':
          this.stepNum = STEPS[STEP_NAMES[idx - 1]]
          break
        case 'next':
          this.stepNum = STEPS[STEP_NAMES[idx + 1]]
          break
        case 'first':
          this.stepNum = STEPS[STEP_NAMES[0]]
          break
        default:
          this.stepNum = STEPS[direction]
        }
      },
      async checkRunningStatus () {
        try {
          const { taskId, status, resultStatus, resultUrl, resultDesc, poiCount, poiTaskDoneCount, productCount } = await fetchGetRunningTask()
          if (taskId > -1) {
            this.poiCount = poiCount
            if (BATCH_REL_TASK_STATUS.FINISH === status) {
              this.resultStatus = resultStatus
              this.resultUrl = resultUrl
              this.resultDesc = resultDesc
              this.productCount = productCount
              this.stepNum = STEPS['FINISH']
            } else {
              this.poiCount = poiCount
              this.poiTaskDoneCount = poiTaskDoneCount
              this.stepNum = STEPS['RELATE']
              this.status = status
            }
          } else {
            this.stepNum = STEPS['PRODUCT']
          }
        } catch (err) {
          this.$Message.error(err.message || '网络错误')
        }
      }
    },
    computed: {
      isNeedFooter () {
        return [STEPS.POI, STEPS.PRODUCT].includes(this.stepNum)
      }
    },
    mounted () {
      this.checkRunningStatus()
    }
  }
</script>

<style lang="less" scoped>
  .steps-container {
    width: 100%;
    .footer {
      width: 100%;
      height: 56px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 30px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #FFFFFF;
      box-shadow: 0 -4px 5px 0 #F7F8FA;
      border-radius: 0 0 2px 2px;
      .left-btn {
        margin-right: 16px;
      }
    }
  }
</style>
