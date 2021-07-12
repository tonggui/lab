<template>
  <div class="empty-page-container">
    <div class="empty">
      <p class="desc">{{ desc }}</p>
      <p class="tip">{{ tip }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'empty-page',
    props: {
      desc: String,
      tip: String
    }
  }
</script>

<style lang="less" scoped>
.empty-page-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 55vh;
  .empty {
    .desc {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #3F4156;
      text-align: center;
      line-height: 16px;
      margin-bottom: 8px;
    }
    .tip {
      font-size: 14px;
      color: #A2A4B3;
      text-align: center;
      line-height: 16px;
    }
  }
}
</style>
