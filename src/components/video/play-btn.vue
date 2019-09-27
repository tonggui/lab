<template>
  <div class="play-btn" v-on="$listeners" :style="style">
    <Icon type="play-arrow" :size="iconSize" />
  </div>
</template>

<script>
  export default {
    name: 'play-btn',
    props: {
      size: {
        type: Number,
        default: 50
      }
    },
    computed: {
      style () {
        return {
          width: `${this.size}px`,
          height: `${this.size}px`
        }
      },
      iconSize () {
        return Math.floor(this.size * 0.75)
      }
    }
  }
</script>

<style lang="less" scoped>
  .play-btn {
    @btnSize: 50px;
    width: @btnSize;
    height: @btnSize;
    border-radius: 50%;
    background: rgba(255, 255, 255, .9);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
