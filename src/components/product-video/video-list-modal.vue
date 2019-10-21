<template>
  <Modal
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    @on-cancel="handleCancel"
  >
    <span class="modal-header">
      <span class="back" v-show="!showFooter" @click="back">
        <Icon type="arrow-back-ios" :size="18" />返回
      </span>
      <span class="title">{{ modalTitle }}</span>
    </span>
    <div class="main-content" v-show="!uploadMode && !previewVideo">
      <div class="main-content-header">
        <span class="label">视频选择列表</span>
        <Button type="primary" icon="cloud-upload" @click="uploadMode = true">本地上传</Button>
      </div>
      <div class="video-list-wrapper">
        <VideoList
          :loading="loading"
          :list="videoList"
          :selected="selectedVideo"
          @preview="handlePreview"
          @select="handleSelect"
        />
      </div>
      <div class="page-container" v-show="total > pageSize">
        <Page
          :current="pageNum"
          :pageSize="pageSize"
          :total="total"
          @on-change="getVideoList"
        />
      </div>
    </div>
    <div class="video-preview" v-show="previewVideo">
      <VideoPlayer autoPlay :playBtnSize="64" :src="previewVideo ? previewVideo.src : ''" :poster="previewVideo ? previewVideo.poster : ''" />
    </div>
    <div class="local-upload" v-show="uploadMode">
      <FileSelector
        :on-start="onFileUploadStart"
        :on-success="onFileUploadSuccess"
        :on-error="onFileUploadError"
      />
    </div>
    <div class="footer" slot="footer">
      <div v-show="showFooter">
        <Button style="float: left" @click="goToVideoCenter">进入视频管理空间</Button>
        <Button type="primary" :disabled="!selectedVideo" @click="confirm">确认选择</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
  import VideoList from './video-list'
  import VideoPlayer from '../video/video-player'
  import FileSelector from '../video/file-selector'
  import { fetchValidVideoList } from '@/data/repos/videoRepository'
  import { poiId } from '@/common/constants'

  export default {
    name: 'video-list-modal',
    components: { VideoList, VideoPlayer, FileSelector },
    props: {
      value: Boolean,
      onFileUploadStart: Function,
      onFileUploadSuccess: Function,
      onFileUploadError: Function
    },
    mounted () {
      // 只有modal打开时才去加载数据
      if (this.value) {
        this.getVideoList()
      }
    },
    data () {
      return {
        uploadMode: false, // 是否显示本地上传
        previewVideo: null, // 当前预览的视频
        selectedVideo: null, // 当前选中的视频
        videoList: [], // 视频列表
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        total: 0, // 视频总数
        loading: false // 视频列表加载中
      }
    },
    computed: {
      modalTitle () {
        let title = '选择视频'
        if (this.uploadMode) {
          title = '上传视频'
        } else if (this.previewVideo) {
          title = this.previewVideo.title
        }
        return title
      },
      showFooter () {
        return !this.uploadMode && !this.previewVideo
      }
    },
    watch: {
      value (v) {
        // 当modal打开发现没有数据时加载一次数据
        if (v && this.videoList.length < 1) {
          this.getVideoList()
        }
        if (!v) {
          this.clear()
        }
      }
    },
    methods: {
      back () {
        this.uploadMode = false
        this.previewVideo = null
      },
      getVideoList (pageNum = 1) {
        this.loading = true
        this.pageNum = pageNum
        fetchValidVideoList({ pageNum, pageSize: this.pageSize }).then(data => {
          this.videoList = data.list
          this.total = data.totalNum || 0
        }).finally(() => {
          this.loading = false
        })
      },
      confirm () {
        this.$emit('confirm', this.selectedVideo)
      },
      handlePreview (video) {
        this.previewVideo = video
      },
      handleSelect (video) {
        this.selectedVideo = video
      },
      handleCancel () {
        this.clear()
        this.$emit('on-cancel')
        this.$emit('input', false)
      },
      clear () {
        this.uploadMode = false
        this.previewVideo = null
        this.selectedVideo = null
      },
      goToVideoCenter () {
        this.$Modal.confirm({
          title: '离开编辑商品',
          content: '即将离开商品编辑页，已编辑内容将不会保存',
          onOk: () => {
            this.$router.push({ name: 'videoCenter', query: { wmPoiId: poiId } })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .modal-header {
    font-size: @font-size-large;
    font-weight: 500;
    display: flex;
    align-items: center;
    line-height: 1;
    .back {
      display: inline-flex;
      align-items: center;
      padding-right: 10px;
      margin-right: 10px;
      border-right: 1px solid @border-color-base;
      cursor: pointer;
    }
  }
  .main-content {
    padding: 20px 0 0;
    .main-content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label {
        color: @text-tip-color;
      }
    }
  }
  .video-preview, .local-upload {
    margin-top: 30px;
  }
  .video-list-wrapper {
    margin: 10px 0;
  }
  .page-container {
    text-align: right;
  }
</style>
