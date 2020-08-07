<template functional>
  <div
    class="excel-template-radio-item"
    :class="{ 'is-border': props.border, 'checked': props.checked }"
    v-on="listeners"
  >
    <div class="excel-template-radio-item-title-container">
      <Radio :value="props.checked" :disabled="props.disabled" size="large">
        <span class="excel-template-radio-item-title" v-if="props.title">{{ props.title }}</span>
      </Radio>
    </div>
    <div class="excel-template-radio-item-description">{{ props.description }}</div>
    <a :href="props.link" :download="props.linkName" class="excel-template-radio-item-content">
      <span class="link-name">
        <span>{{ props.name || props.linkName }}</span>
        <span class="link-time">{{ props.time ? `更新于${props.time}` : '' }}</span>
      </span>
      <span class="link-download">
        <Icon local="download" />
      </span>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'ExcelTemplateRadio',
    props: {
      checked: Boolean,
      disabled: Boolean,
      border: {
        type: Boolean,
        default: true
      },
      title: String,
      link: String,
      linkName: String,
      name: String,
      time: String,
      description: String
    }
  }
</script>

<style lang="less" scoped>
  @prefix: ~"excel-template-radio-item";
  .@{prefix} {
    background: @component-bg;
    max-width: 420px;
    box-sizing: border-box;
    padding: 20px;
    cursor: pointer;
    filter: opacity(0.5);
    &.checked {
      filter: opacity(1) !important;
    }
    &:hover {
      filter: opacity(0.8);
    }
    &.is-border {
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
    }
    &-title-container {
      font-size: @font-size-base;
      color: @text-color;
      display: flex;
      align-items: center;
      /deep/ .boo-radio-wrapper {
        display: flex;
        align-items: center;
      }
    }
    &-title {
      font-size: @font-size-base;
      line-height: 20px;
      color: @text-color;
      font-weight: bold;
    }
    &-content {
      display: flex;
      align-items: center;
      background: #F4F4F4;
      height: 44px;
      line-height: 32px;
      width: 100%;
      padding: 6px 10px;
      margin-top: 12px;
      white-space: nowrap;
      &:hover {
        background: #f5f5f7;
      }
      &::before {
        content: '';
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-right: 6px;
        background: url(~@/assets/excel.png);
        background-size: 100% 100%;
      }
      .link-download {
        color: @text-color;
        font-size: 20px;
        /deep/ .boo-icon {
          line-height: 32px;
        }
      }
      .link-name {
        flex: 1;
        display: flex;
        justify-content: space-between;
        font-size: @font-size-small;
        color: #2F3140;
      }
      .link-time {
        color: @text-tip-color;
        font-size: @font-size-small;
        margin-left: 6px;
        margin-right: 12px;
      }
    }
    &-description {
      color: @text-color;
      font-size: @font-size-small;
      line-height: 17px;
      margin-top: 6px;
    }
  }
</style>
