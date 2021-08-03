<template>
  <div class="result-banner-container">
    <div v-if="isSuccess" class="success">
      <Icon local="success" size="50" style="marginRight: 16px" />
      <slot name="success"></slot>
    </div>
    <div v-else class="fail">
      <div>
        <Icon local="fail" size="50" style="marginRight: 16px" />
        <slot name="fail"></slot>
      </div>
      <Button type="primary" @click="$emit('on-click-btn')">{{buttonText}}</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'result-banner',
    props: {
      type: {
        type: String,
        required: true,
        validator (val) {
          return ['success', 'fail'].includes(val)
        }
      },
      buttonText: String
    },
    computed: {
      isSuccess () {
        return this.type === 'success'
      }
    }
  }
</script>

<style lang="less" scoped>
  .result-banner-container {
    width: 100%;
    //max-width: 1140px;
    height: 140px;
    .success {
      width: 100%;
      height: 100%;
      padding: 45px 30px;
      background-image: linear-gradient(-45deg, rgba(0,191,127,0.12) 0%, rgba(0,191,127,0.03) 100%);
      border-radius: 8px;
    }
    .fail {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 45px 30px;
      background-image: linear-gradient(-45deg, rgba(255,26,26,0.12) 0%, rgba(255,65,26,0.02) 100%);
      border-radius: 8px;
    }
  }
</style>
