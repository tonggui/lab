<template functional>
  <div class="product-info-image">
    <img v-lazy="props.product.picture" v-if="!!props.product.picture" />
    <Icon type="photo" size="40" v-else />
    <span v-if="props.product.mark && props.product.mark.name" class="marker bottom-marker" :class="`is-${props.product.mark.type}`">{{ props.product.mark.name }}</span>
    <span v-if="props.product.isOTC" class="marker left-marker"></span>
    <span v-if="props.product.video && props.product.video.length > 0" class="marker right-marker">{{ props.product.video.length | duration }}</span>
  </div>
</template>
<style lang="less" scoped>
.product-info-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  box-sizing: border-box;
  border: 1px solid @border-color-base;
  background: #fff;
  img {
    max-height: 100%;
    max-width: 100%;
  }
  .marker {
    position: absolute;
    padding: 4px;
    font-size: @font-size-small;
    color: #ffffff;
    text-align: center;
    line-height: 1;
  }
  .bottom-marker {
    bottom: 0;
    left: 0;
    right: 0;
    &.is-danger {
      background: rgba(244, 113, 107, .9);
    }
    &.is-normal {
      background: rgba(63, 65, 86, .9);
    }
  }
  .left-marker {
    left: 0;
    top: 0;
    padding: 2px;
    background: #63D29D;
  }
  .right-marker {
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    border-radius: 0 0 0 2px;
  }
}
</style>
