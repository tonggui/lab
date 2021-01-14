<template>
  <div class="merchant-medicine-tip">
    <h2 class="message">{{ warningText }}</h2>
    <!-- <p class="desc" v-if="warningText">
      <Icon type="error" theme="filled" :style="{ color: '#F8B500', fontSize: '14px' }" />
      <span>{{ warningText }}</span>
    </p> -->
  </div>
</template>

<script>
  export default {
    name: 'PriceTip',
    props: {
      warningText: String
    }
  }
</script>

<style scoped lang="less">
  .merchant-medicine-tip {
    background: rgba(248, 181, 0, .1);
    padding: 10px 16px;
    margin-bottom: 16px;
    overflow: hidden;
    .message {
      color: @text-color-secondary;
      font-size: @font-size-base;
      margin: 6px 0;
    }
    // .desc {
    //   color: @text-description-color;
    //   font-size: 12px;
    //   margin: 5px 0;
    //   line-height: 1;
    //   span {
    //     margin-left: 4px;
    //   }
    // }
  }
</style>
