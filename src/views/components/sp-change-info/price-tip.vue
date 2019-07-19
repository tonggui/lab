<template>
  <div class="price-tip">
    <h2 class="message">当前商品价格：¥{{price}}</h2>
    <p class="desc">
      <Icon type="error-outline" theme="filled" :style="{ color: '#F8B500', marginRight: 5, fontSize: 13 }" />
      如价格与商品不对应，请替换商品后立即修改价格，或对现在商品进行纠错
    </p>
  </div>
</template>

<script>
  export default {
    name: 'PriceTip',
    props: {
      price: [Number, String]
    }
  }
</script>

<style scoped lang="less">
  .price-tip {
    background: rgba(248, 181, 0, .1);
    padding: 10px 16px;
    margin-bottom: 16px;
    overflow: hidden;
    .message {
      color: @text-color-secondary;
      font-size: @font-size-base;
      margin: 5px 0;
    }
    .desc {
      vertical-align: middle;
      color: @text-description-color;
      font-size: 12px;
      margin: 5px 0;
      line-height: 1;
    }
  }
</style>
