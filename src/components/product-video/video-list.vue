<template>
  <div class="video-list">
    <Spin fix v-if="loading" />
    <div class="gallery">
      <div class="video-wrapper" v-for="(item, i) in list" :key="item.id || i">
        <VideoItem
          :value="item"
          :active="selected && selected.id === item.id"
          v-on="$listeners"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import VideoItem from './video-item'

  export default {
    name: 'video-list',
    components: { VideoItem },
    props: {
      selected: {
        type: Object,
        default () {
          return null
        }
      },
      list: {
        type: Array,
        default () {
          return []
        }
      },
      loading: Boolean
    }
  }
</script>

<style lang="less" scoped>
  .video-list {
    position: relative;
    margin: 0 -5px;
    .gallery {
      min-height: 40px;
    }
    .video-wrapper {
      display: inline-block;
      width: 20%;
      padding: 5px;
      line-height: 0;
    }
  }
</style>
