<template>
  <Modal
    :title="modelTitle"
    :value="value"
    @on-cancel="handleCancelEvent"
  >
    <div class="video-preview">
      <Input
        v-if="editMode || videoTitle"
        v-model="videoTitle"
        placeholder="请输入视频标题"
        :disabled="disabled"
      />
      <VideoPlayer
        class="video-player"
        :src="video ? video.src : ''"
        :poster="video ? video.poster : ''"
      />
    </div>
    <template slot="footer">
      <Button type="primary" @click="handleConfirmEvent">完成</Button>
    </template>
  </Modal>
</template>

<script>
  import { get } from 'lodash'
  import VideoPlayer from '../video/video-player'

  export default {
    name: 'VideModal',
    components: {
      VideoPlayer
    },
    props: {
      value: Boolean,
      video: Object,
      title: String,
      editMode: {
        type: Boolean,
        default: () => false
      },
      disabled: Boolean
    },
    data () {
      return {
        videoTitle: get(this.video, 'title', '')
      }
    },
    watch: {
      video () {
        this.videoTitle = get(this.video, 'title', '')
      }
    },
    computed: {
      modelTitle () {
        if (this.title) {
          return this.title
        }
        return this.editMode ? '编辑视频' : '预览视频'
      }
    },
    methods: {
      handleCancelEvent () {
        this.$emit('cancel')
      },
      handleConfirmEvent () {
        this.$emit('confirm', this.videoTitle)
      }
    }
  }
</script>

<style lang="less" scoped>
  .video-player {
    margin-top: 10px;
    border-radius: 2px;
    overflow: hidden;
  }
</style>
