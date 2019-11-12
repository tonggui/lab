<template>
  <div class="trigger-display">
    <div v-if="label" class="trigger-display-label">{{ label }}</div>
    <div class="trigger-display-content">
      <div v-if="size" class="trigger-display-text">
        <span>已选定<strong>{{ size }}</strong>个门店</span>
        <a v-if="allowClear" @click="handleClear">清空</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'trigger-display',
    props: {
      allowClear: Boolean,
      size: Number,
      label: String
    }
  }
</script>
<style lang="less" scoped>
  .trigger-display {
    display: flex;
    align-items: center;
    &-label {
      width: 60px;
    }
    &-content {
      width: 450px;
      height: 36px;
      padding: 0 10px;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
      margin-left: 10px;
      position: relative;
      line-height: 36px;
      cursor: pointer;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 8px;
      a {
        font-size: @font-size-small;
      }
      &.is-disabled {
        cursor: not-allowed;
        background:  @disabled-bg;
      }
    }
    strong {
      color:  @link-color;
      margin: 0 4px;
    }
    &-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
</style>
