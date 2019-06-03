<template>
  <div class="video-center">
    <Breadcrumb class="breadcrumb" separator=">">
      <BreadcrumbItem to="/">商品管理</BreadcrumbItem>
      <BreadcrumbItem>视频管理</BreadcrumbItem>
    </Breadcrumb>
    <Alert class="toptip" closable type="warning" show-icon>
      好的视频可以提升单品转化，打造爆款商品，如何拍摄吊炸天视频？
      <a class="tutorial" href="https://collegewm.meituan.com/post/detail/677" target="_blank">操作链接</a>
    </Alert>
    <div class="video-panel">
      <div class="video-panel-header">
        <div class="section-header">
          <h3>视频列表 <span class="count">({{ total }}条)</span></h3>
          <div class="usage">已用 {{ usage | capacity('M') }} / 2G</div>
        </div>
        <Button size="large" type="primary" @click="showUploadModal = true" icon="cloud-upload">上传视频</Button>
      </div>
      <div class="loading-container" v-if="loading">
        <Spin size="large" fix></Spin>
      </div>
      <div class="file-selector-container" v-if="!loading && !videoList.length">
        <file-selector></file-selector>
      </div>
      <div class="video-list-container" v-if="!loading && videoList.length">
        <video-list :data="videoList" @preview="preview"></video-list>
      </div>
    </div>
    <Modal
      v-model="showUploadModal"
      title="上传视频"
      width="800"
      footer-hide
      >
      <div class="file-selector-container">
        <file-selector></file-selector>
      </div>
    </Modal>
    <Modal
      :value="!!previewVideo"
      title="视频预览"
      footer-hide
      width="500"
      @input="closePreview"
      >
      <div style="padding-bottom: 20px">
        <video-player :src="previewVideo ? previewVideo.url_ogg : ''" :poster="previewVideo ? previewVideo.main_pic_small_url : ''"></video-player>
      </div>
    </Modal>
  </div>
</template>

<script>
import FileSelector from './components/file-selector'
import VideoList from './components/video-list'
import VideoPlayer from '@/components/video/video-player'
import { VIDEO_STATUS, UPLOAD_STATUS } from './constant'
import { fetchVideoList } from '@/data/repos/videoRepository'

export default {
  name: 'video-center',
  components: { FileSelector, VideoList, VideoPlayer },
  created () {
    this.timeout = null
    this.fetchVideoList()
  },
  destroyed () {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  data () {
    return {
      showUploadModal: false,
      showVideoModal: false,
      usage: 0,
      loading: false,
      videoList: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
      previewVideo: null
    }
  },
  methods: {
    // 关闭视频预览
    closePreview () {
      this.previewVideo = null
    },
    // 视频预览
    preview (video) {
      this.previewVideo = video
    },
    fetchVideoList () {
      this.loading = true
      fetchVideoList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(data => {
        const { usage, totalNum, list } = data
        this.usage = usage
        this.total = totalNum
        list.forEach(v => {
          const status = v.status
          switch (status) {
            case VIDEO_STATUS.TRANSCODING:
              v.uploadStatus = UPLOAD_STATUS.TRANSCODING
              break
            case VIDEO_STATUS.TRANSCODE_ERROR:
              v.uploadStatus = UPLOAD_STATUS.TRANSCODE_ERROR
              break
            case VIDEO_STATUS.SUCCESS:
              v.uploadStatus = UPLOAD_STATUS.SUCCESS
              break
            case VIDEO_STATUS.FROZEN:
              v.uploadStatus = UPLOAD_STATUS.FROZEN
              break
          }
        })
        this.videoList = list
        // 有转码中的视频时，间隔10秒刷新数据
        const hasTranscodingVideo = list.some(v => v.status === VIDEO_STATUS.TRANSCODING)
        if (hasTranscodingVideo) {
          if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
          }
          this.timeout = setTimeout(this.fetchVideoList, 10 * 1000)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scope lang="less">
  .video-center {
    color: @color-primary;
    .breadcrumb {
      margin-bottom: 10px;
    }
    .toptip {
      padding: 8px 40px 8px 38px;
    }
    text-align: left;
    .tutorial {
      float: right;
    }
    .video-panel {
      background: #FFFFFF;
      box-shadow: 0 0 6px 0 #F3F3F4;
      border-radius: 2px;
      padding: 0 10px;
      .video-panel-header {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        padding: 20px 10px;
        z-index: 2;
        border-bottom: 1px solid @color-gray2;
        h3 {
          font-weight: bold;
          font-size: 20px;
          .count {
            font-weight: normal;
            font-size: 14px;
          }
        }
        .usage {
          color: @color-weak;
        }
      }
      .video-list-container {
        padding: 0 0 10px;
      }
    }
  }
  .loading-container {
    position: relative;
    height: 100px;
  }
  .file-selector-container {
    width: 100%;
    max-width: 800px;
    padding: 20px;
    margin: 0 auto;
  }
</style>
