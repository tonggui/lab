<template>
  <div class="problem-panel">
    <p class="info-title">{{ title }}<span class="info-sub-title">共{{ count }}项</span></p>
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'panel',
    props: {
      title: {
        type: String,
        default: ''
      },
      count: {
        type: [Number, String],
        default: 0
      }
    }
  }
</script>

<style lang='less'>
.problem-panel {
  width: 49.5%;
  min-height: 690px;
  background-color: #fff;
  .info-title {
    font: bold 20px/26px '微软雅黑';
    padding: 20px 20px 10px 20px;
    .info-sub-title {
      font-size: 14px;
      color: colorWeak;
      padding-left: 20px;
      font-weight: normal;
    }
  }
}
</style>
