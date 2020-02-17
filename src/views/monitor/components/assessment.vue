<template>
  <div class="product-quality-assessment">
    <div :class="['assessment-pic', summary.status ? 'positive' : 'negative']"></div>
    <div class="assessment">
      <p class="desc">本次共检测了 {{ summary.total }} 个商品，<span v-if="summary.negCount">其中发现 <span class="neg-count">{{ summary.negCount }}</span> 个商品问题，建议立即优化！</span><span v-else>未发现商品问题</span></p>
      <p class="date">更新日期：{{ summary.date }}</p>
    </div>
    <div v-if="extra" class="assessment-tip">
      <div class="tip-text">
        店内异常商品请及时进行处理，<span class="red">否则将影响您店内商品的售卖，部分问题将会同时影响门店曝光</span>，其中有“内测”字样的，不影响商品及门店曝光
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'assessment',
    props: {
      summary: {
        type: Object,
        default: () => ({
          status: true, // positive status
          total: 0,
          negCount: 0,
          date: '2019-10-05'
        })
      },
      extra: { // 评估结果的右侧的提示否是展示
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang='less'>
.product-quality-assessment {
  position: relative;
  display: flex;
  justify-content: flex-start;
  height: 120px;
  padding: 25px 30px;
  background-color: @component-bg;
  margin-bottom: 10px;
  .assessment-pic {
    display: inline-block;
    width: 70px;
    height: 70px;
    margin-right: 20px;
    vertical-align: middle;
    &.positive {
      background-image: url('../../../assets/smile.png');
    }
    &.negative {
      background-image: url('../../../assets/cry.png');
    }
  }
  .assessment {
    margin: auto 0;
    .desc {
      color: @primary-color;
      font: bold 20px / 26px '微软雅黑';
      .neg-count {
        color: @text-red;
      }
    }
    .date {
      color: @color-gray2;
      font: normal 14px / 19px '微软雅黑';
      margin-top: 8px;
      margin-bottom: 0;
    }
  }
  .assessment-tip {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .tip-text {
      width: 427px;
      padding-left: 25px;
      padding-right: 25px;
      border-left: 1px solid @color-gray2;
      margin-left: 25px;
      overflow: auto;
    }
    .red {
      color: @text-red;
    }
  }
}
</style>
