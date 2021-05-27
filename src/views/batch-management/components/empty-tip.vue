<template>
  <div class="empty-tip">
    <div class="content">
      <img class="icon" src="//p0.meituan.net/ingee/a06a1255117440ff433d3a1a1235775e1241.png" alt="tip-icon">
      <div>
        <p>总部不允许分店使用此共功能</p>
        <p>如有疑问请联系贵公司的总部工作人员</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'empty-tip'
  }
</script>

<style scoped lang="less">
  .empty-tip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    color: #222222;
    text-align: center;
    line-height: 12px;

    .content {
      width: 204px;
      height: 114px;
      justify-content: center;
      align-items: center;

      .icon {
        width: 50px;
        height: 50px;
        object-fit: contain;
        margin-bottom: 30px;
      }

      p:nth-child(1) {
        margin-bottom: 10px;
      }
    }
  }
</style>
