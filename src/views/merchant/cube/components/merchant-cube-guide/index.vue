<template>
  <div class="merchant-cube-guide-container">
    <a class="how" href="">如何用魔方快捷创建？</a>
    <span class="divider"></span>
    <a class="what" href="">什么是关联分店？</a>
  </div>
</template>

<script>
  export default {
    name: 'merchant-cube-guide'
  }
</script>

<style lang="less" scoped>
  .merchant-cube-guide-container {
    font-weight: 400;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    display: flex;
    align-items: center;
    .divider {
      height: 14px;
      width: 1px;
      background: #EEEEEE;
      margin: 0 10px;
    }
    .how {
      color: #666666;
    }
    .what {
      color: #999999;
    }
  }
</style>
