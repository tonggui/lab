<template>
  <div class="steps-container">
    <Steps :current="stepNum" :list="list"/>
    <StepProduct v-if="stepNum === 0" />
    <StepPoi v-else-if="stepNum === 1"/>
    <footer class="footer">
      <template v-if="stepNum === 0">
        <Button>取消</Button><Button @click="stepNum++" type="primary">下一步</Button>
      </template>
      <template v-else-if="stepNum === 1">
        <Button @click="stepNum--">上一步</Button>
        <Button type="primary">确定关联</Button>
      </template>
    </footer>
  </div>
</template>

<script>
  import Steps from '../../components/steps'
  import StepProduct from './step-product'
  import StepPoi from './step-poi'
  export default {
    name: 'steps',
    data () {
      return {
        data: {
        },
        stepNum: 0,
        list: [{ id: 0, title: '选择商品与关联信息' }, { id: 1, title: '选择门店' }, { id: 2, title: '关联中' }, { id: 3, title: '关联完成' }]
      }
    },
    components: {
      Steps,
      StepProduct,
      StepPoi
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
