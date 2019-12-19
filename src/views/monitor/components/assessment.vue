<template>
  <div class="product-quality-assessment">
    <div :class="['assessment-pic', summary.status ? 'positive' : 'negative']"></div>
    <div class="assessment">
      <p class="desc">
        本次共检测了 {{ summary.total }} 个商品，<span v-if="summary.negCount">其中发现 <span class="neg-count">{{ summary.negCount }}</span> 个商品问题，建议立即优化！</span><span v-else>未发现商品问题</span>
      </p>
      <p class="date">更新日期：{{ summary.date }}</p>
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
      }
    }
  }
</script>

<style lang='less'>
.product-quality-assessment {
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
}
</style>
