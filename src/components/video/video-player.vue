<template>
  <div class="video-player">
    <video
      :src="src"
      preload
      :controls="showControls"
      ref="video"
      @ended="onEnd"
      ></video>
    <div class="poster" :style="{ backgroundImage: `url(${poster || ''})` }" v-show="!showControls"></div>
    <div class="play-btn" @click="play" v-show="!showControls">
      <Icon type="play-arrow" size="40" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'video-player',
  props: {
    src: String,
    poster: String
  },
  data () {
    return {
      showControls: false
    }
  },
  watch: {
    src () {
      // 当视频发生变化时，停止并重置
      this.$refs.video.pause()
      this.showControls = false
    }
  },
  methods: {
    play () {
      this.$refs.video.play()
      this.showControls = true
    },
    onEnd () {
      this.showControls = false
    }
  }
}
</script>

<style lang="less" scoped>
  .video-player {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    video, .poster {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.8);
    }
    .poster {
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      background-color: transparent;
    }
    .play-btn {
      @btnSize: 50px;
      position: absolute;
      width: @btnSize;
      height: @btnSize;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: rgba(255, 255, 255, .9);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
</style>
