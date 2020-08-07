<template>
  <div class="item-layout" :data-content="identifier">
    <div class="item-title">{{title}}</div>
    <div class="item-content">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ItemLayout',
    props: {
      title: String,
      identifier: String
    }
  }
</script>

<style scoped lang="less">
.item-layout {
  display: flex;
  margin-bottom: 32px;
  align-items: baseline;
  flex-direction: column;
  padding-left: 34px;
  position: relative;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #36394D;
    background: #F4F4F5;
    text-align: center;
    line-height: 24px;
    font-size: @font-size-large;

    content: attr(data-content);
  }

  .item-title {
    margin-bottom: 20px;
    color: @color-gray1;
    line-height: 24px;
    display: inline-block;
  }

  .item-content {
  }
}
</style>
