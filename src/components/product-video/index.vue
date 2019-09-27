<template>
  <div class="product-video">
    <VideoBox
      :video="(value && value.id) ? value : null"
      @del="handleDel"
      @edit="handleEdit"
      @add="showVideoListModal = true"
    />
    <ul class="note">
      <li>1. 建议比例：1:1 或者 16:9</li>
      <li>2. 文件格式：mp4(建议)、wmv、avi、mpg、mpeg、3gp、mov、flv、f4v、m4v、m2t、mts、rmvb、vob、mkv、webm</li>
      <li>3. 文件大小：选择本地视频≤200mb以内</li>
    </ul>
    <Modal
      title="编辑视频"
      :value="!!curEditVideo"
      @on-cancel="handleEdit(null)"
    >
      <div class="video-preview">
        <Input v-model="curEditName" placeholder="请输入视频标题" />
        <VideoPlayer class="video-player" :src="curEditVideo ? curEditVideo.src : ''" :poster="curEditVideo ? curEditVideo.poster : ''" />
      </div>
      <template slot="footer">
        <Button type="primary" @click="finishEdit">完成</Button>
      </template>
    </Modal>
    <VideoListModal
      v-model="showVideoListModal"
      :width="800"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
  import VideoBox from './video-box'
  import VideoPlayer from '../video/video-player'
  import VideoListModal from './video-list-modal'

  export default {
    name: 'product-video',
    components: { VideoBox, VideoPlayer, VideoListModal },
    props: {
      value: {
        type: Object,
        default () {
          return null
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        curEditVideo: null, // 当前编辑视频
        curEditName: '', // 当前编辑视频的名称
        showVideoListModal: false, // 是否显示视频modal
        uploadMinimized: false, // 是否最小化上传中modal
        uploadProgress: 0 // 文件上传进度
      }
    },
    methods: {
      handleDel () {
        this.handleChange(null)
      },
      handleChange (v) {
        this.$emit('change', v)
      },
      handleEdit (video) {
        this.curEditVideo = video
        this.curEditName = video ? (video.title || '') : ''
      },
      handleConfirm (video) {
        this.handleChange(video)
        this.showVideoListModal = false
      },
      finishEdit () {
        if (!this.curEditName) {
          this.$Message.warning('视频标题不能为空')
          return
        }
        this.handleChange({
          ...this.curEditVideo,
          title: this.curEditName
        })
        this.handleEdit(null)
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-video {
    display: flex;
    align-items: center;
    line-height: 1.5;
    .note {
      list-style: none;
      color: @text-tip-color;
      margin-left: 20px;
    }
  }
  .video-player {
    margin-top: 10px;
    border-radius: 2px;
    overflow: hidden;
  }
</style>
