<template>
  <div class="encouraging-tip">
    <div class="icon-wrapper">
      <Icon type="thumb-up" size="64" color="#F89800" />
    </div>
    <p>暂无违规商品记录,请继续保持!</p>
  </div>
</template>

<style lang='less' scoped>
.encouraging-tip {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border: 1px solid @color-gray5;
    border-radius: 50px;
  }
  p {
    color: @color-gray2;
    padding-top: 15px;
  }
}
</style>
