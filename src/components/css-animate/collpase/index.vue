<template>
  <height-animate name="collpase" :duration="duration" :appear="true">
    <slot></slot>
  </height-animate>
</template>
<script>
import HeightAnimate from "../height-animate/height";
export default {
  name: "collpase-animate",
  data() {
    return {
      duration: {
        enter: 500,
        leave: 0
      }
    };
  },
  components: {
    HeightAnimate
  }
};
</script>
<style lang="less">
.animate-collpase {
  &-enter {
    opacity: 0;
    height: 0;
  }
  &-enter-active {
    transition: opacity 200ms ease-in, height 300ms ease-in;
  }
  &-enter-to {
    opacity: 1;
    height: auto;
  }
  &-leave-active {
    transition: opacity 100ms ease-in, height 300ms ease-in;
  }
  &-leave-to {
    opacity: 0;
    height: 0;
  }
}
</style>
