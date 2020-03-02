<template functional>
  <div class="excel-template" :class="{ 'is-border': props.border }">
    <div class="excel-template-title">
      <h4 v-if="props.title">{{ props.title }}</h4>
      <small v-if="props.subTitle">{{ props.subTitle }}</small>
      <span>
        <a v-if="props.extraLink" :href="props.extraLink.link" @click="props.extraLink.onClick && props.extraLink.onClick()" :download="props.extraLink.linkName">
          {{ props.extraLink.name || props.extraLink.linkName }}
        </a>
      </span>
      <slot name="extra"></slot>
    </div>
    <a :href="props.link" :download="props.linkName" class="excel-template-content">
      <span class="excel-template-name">
        <span>{{ props.name || props.linkName }}</span>
        <span class="excel-template-time">{{ props.time ? `更新于${props.time}` : '' }}</span>
      </span>
      <span class="excel-template-download">
        <Icon local="download" />
      </span>
    </a>
    <small class="excel-template-description">{{ props.description }}</small>
  </div>
</template>
<script>
  export default {
    props: {
      border: {
        type: Boolean,
        default: true
      },
      title: String,
      subTitle: String,
      extraLink: Object,
      link: String,
      linkName: String,
      name: String,
      time: String,
      description: String
    }
  }
</script>
<style lang="less" scoped>
  @prefix: ~"excel-template";
  .@{prefix} {
    background: @component-bg;
    min-width: 370px;
    box-sizing: border-box;
    padding: 15px;
    white-space: nowrap;
    cursor: pointer;
    &.is-border {
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
    }
    &-title {
      font-size: @font-size-base;
      color: @text-color;
      display: flex;
      justify-content: space-between;
      > *:not(:last-child) {
        margin-right: 10px;
      }
      h4 {
        font-weight: bold;
      }
      a {
        color: @link-color;
        cursor: pointer;
        &:hover {
          color: @link-hover-color;
        }
      }
    }
    &-content {
      display: flex;
      background: #FAFAFA;
      height: 32px;
      line-height: 32px;
      width: 100%;
      margin: 10px auto;
      padding-right: 10px;
      &:hover {
        background: #f5f5f7;
      }
      &::before {
        content: '';
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-right: 10px;
        background: url(~@/assets/excel.png);
        background-size: 100% 100%;
      }
    }
    &-download {
      color: @text-color;
      font-size: 20px;
    }
    &-name {
      flex: 1;
      font-size: @font-size-small;
      color: #2F3140;
    }
    &-time {
      color: @text-tip-color;
      margin-left: 10px;
    }
    &-description {
      color: @text-tip-color;
      font-size: @font-size-small;
      line-height: 16px;
      margin: 0;
    }
  }
</style>
