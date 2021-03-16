<template>
  <div class="steps-container">
    <Steps :current="stepNum" :list="list"/>
    <StepProduct
      v-if="stepNum === steps['PRODUCT']"
      :data="data"
      @data-change="handleDataChange"
    />
    <StepPoi
      v-else-if="stepNum === steps['POI']"
      :data="data"
      @data-change="handleDataChange"
    />
    <StepRel
      :status="status"
      :poiCount="poiCount"
      :poiTaskDoneCount="poiTaskDoneCount"
      v-else-if="stepNum === steps['RELATE']"
    />
    <StepFinish
      :status="finishStatus"
      :result-url="resultUrl"
      :result-desc="resultDesc"
      :checkRunningStatus="checkRunningStatus"
      v-else-if="stepNum === steps['FINISH']"
    />
    <footer class="footer">
      <template v-if="stepNum === steps['PRODUCT']">
        <Button>取消</Button><Button @click="stepNum++" type="primary">下一步</Button>
      </template>
      <template v-else-if="stepNum === steps['POI']">
        <Button @click="stepNum--">上一步</Button>
        <Button type="primary" @click="handleRelate">确定关联</Button>
      </template>
    </footer>
  </div>
</template>

<script>
  import Steps from '../../components/steps'
  import StepProduct from './step-product/index'
  import StepPoi from './step-poi/index'
  import StepRel from './step-rel'
  import StepFinish from './step-finish'
  import { fetchGetRunningTask } from '@/data/repos/merchantPoi'
  import { BATCH_REL_TASK_STATUS } from '@/data/enums/batch'

  const STEPS = {
    'PRODUCT': 0,
    'POI': 1,
    'RELATE': 2,
    'FINISH': 3
  }
  export default {
    name: 'steps',
    data () {
      return {
        steps: STEPS,
        status: BATCH_REL_TASK_STATUS.INLINE,
        poiCount: 0,
        poiTaskDoneCount: 0,
        finishStatus: 1,
        resultUrl: '',
        resultDesc: '',
        data: {
          poiSelect: '',
          poiList: [],
          dataSourceType: '',
          productSelect: '',
          dataSourceValues: [],
          syncType: ''
        },
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
        console.log('这里的啦啦啦', key, value)
        this.data[key] = value
      },
      handleRelate () {
        // TODO 关联接口
        this.stepNum = STEPS['RELATE']
        this.checkRunningStatus()
      },
      loopCheckRunningStatus () {
        this.timeout = setTimeout(this.checkRunningStatus, 30 * 1000)
      },
      async checkRunningStatus () {
        try {
          const { taskId, status, poiCount, poiTaskDoneCount, finishStatus, resultUrl, resultDesc } = await fetchGetRunningTask()
          if (taskId > -1) {
            if (BATCH_REL_TASK_STATUS.FINISH === status) {
              if (this.timeout) clearTimeout(this.timeout)
              this.finishStatus = finishStatus
              this.resultUrl = resultUrl
              this.resultDesc = resultDesc
              this.stepNum = STEPS['FINISH']
            } else {
              this.stepNum = STEPS['RELATE']
              this.poiCount = poiCount
              this.poiTaskDoneCount = poiTaskDoneCount
              this.status = status
              this.loopCheckRunningStatus()
            }
          } else {
            this.stepNum = STEPS['PRODUCT']
          }
        } catch (err) {
        }
      }
    },
    mounted () {
      console.log('加载了')
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
    }
  }
</style>
