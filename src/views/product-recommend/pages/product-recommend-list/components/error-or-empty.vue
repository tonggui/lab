<template>
  <div class="fail-or-empty-container">
    <div v-if="isFail" class="fail">加载失败，请点击<a href="" @click.prevent="$emit('on-retry')">重试</a></div>
    <div v-else-if="!isFail && isEmpty" class="empty">
      <p class="desc">暂无搜索结果</p>
      <p class="tip">可更换搜索词试试～</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fail-or-empty',
    props: {
      isFail: Boolean,
      isEmpty: Boolean
    }
  }
</script>

<style lang="less" scoped>
.fail-or-empty-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  .fail {
    font-size: 14px;
    color: #585A6E;
    line-height: 16px;
    > a {
      text-decoration: underline;
    }
  }
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
