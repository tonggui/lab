<template>
  <div class="trigger-display">
    <div :class="{'trigger-display-content': true, 'is-disabled': disabled }" @click="$emit('show')">
      <div v-if="size" class="trigger-display-text">
        <span>已选定<strong>{{ size }}</strong>个门店</span>
      </div>
      <div v-else class="trigger-display-empty">
        请选择关联门店
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
      label: String,
      disabled: Boolean
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
      width: 100px;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
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
        pointer-events: none;
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
    &-empty {
      color: #D8D8D8;
    }
  }
</style>
