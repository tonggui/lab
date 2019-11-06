<template>
  <div class="tooltip-help">
    <Tooltip v-bind="$attrs" v-on="$listeners">
      <slot></slot>
      <div class="tooltip-help-icon">
        <slot name="icon">
          <Icon type="help-outline" color="#BABCCC" />
        </slot>
      </div>
      <template slot="content" v-if="$slots.content">
        <slot name="content"></slot>
      </template>
    </Tooltip>
  </div>
</template>
<script>
  export default {
    name: 'tooltip-help'
  }
</script>
<style lang="less" scoped>
  .tooltip-help {
    display: inline-block;
    vertical-align: middle;
    &-icon {
      display: inline-block;
      margin-left: 4px;
    }
  }
</style>
