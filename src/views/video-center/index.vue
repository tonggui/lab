<template>
  <div class="video-center">
    <Breadcrumb class="breadcrumb" separator=">">
      <BreadcrumbItem>
        <a @click="toHome">商品管理</a>
      </BreadcrumbItem>
      <BreadcrumbItem>视频管理</BreadcrumbItem>
    </Breadcrumb>
    <!-- 由于缺少视频教程链接，暂时隐藏这块 -->
    <!-- <Alert class="toptip" closable type="warning" show-icon>
      好的视频可以提升单品转化，打造爆款商品，如何拍摄吊炸天视频？
      <a class="tutorial" href="https://collegewm.meituan.com/post/detail/677" target="_blank">操作链接</a>
    </Alert> -->
    <div class="video-panel">
      <div class="video-panel-header" :class="{ border: !!videoList.length }">
        <div class="section-header">
          <h3>视频列表 <span class="count">({{ total }}条)</span></h3>
          <div class="usage">已用 {{ usage | capacity('M') }} / 1G</div>
        </div>
        <Button
          size="large"
          type="primary"
          @click="showUploadModal = true"
          icon="cloud-upload"
          :loading="uploading"
        >
        {{ uploading ? '上传中' : '上传视频' }}
        </Button>
      </div>
      <div class="file-selector-container centered" v-if="!loading && !videoList.length">
        <file-selector></file-selector>
      </div>
      <div class="loading-container" v-show="!videoList.length && loading">
        <Spin size="large" fix></Spin>
      </div>
      <div class="video-list-container" v-show="allVideoList.length">
        <video-list :data="allVideoList" @preview="preview" @relate="relate" @deleted="fetchVideoList"></video-list>
        <div class="paging-container" v-show="total > pageSize">
          <Page :current="pageNum" :page-size="pageSize" :total="total" show-elevator @on-change="handlePageChange" />
        </div>
      </div>
    </div>
    <Modal
      v-model="showUploadModal"
      title="上传视频"
      width="768"
      footer-hide
      >
      <div class="file-selector-container" style="padding: 0 0 20px 0">
        <file-selector
          multiple
          :on-start="handleUploadStart"
          :on-progress="handleUploadProgress"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        />
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
        <video-player :src="previewVideo ? previewVideo.src : ''" :poster="previewVideo ? previewVideo.poster : ''"></video-player>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :mask-closable="false"
      v-model="showProgressModal"
      width="500"
    >
      <template slot="footer">
        <Button type="primary" @click="showProgressModal = false">最小化至后台上传</Button>
      </template>
      <div class="upload-file-progress" v-for="file in uploadFileList" :key="file.uid">
        <div class="upload-file-">{{ file.name }}</div>
        <Progress
          v-if="file.showProgress"
          status="active"
          :percent="file.status === 'finished' ? 100 : (file.percentage * 0.99) | floor"
          :stroke-width="5"
        />
      </div>
    </Modal>
    <related-product-drawer :video="relateVideo" @input="closeRelate" width="1000" @confirm="handleRelConfirm" />
  </div>
</template>

<script>
  import productListPage from '@sgfe/eproduct/navigator/pages/product/list'
  import { jumpTo } from '@sgfe/eproduct/navigator'
  import { poiId } from '@/common/constants'
  import FileSelector from '@/components/video/file-selector'
  import VideoList from './components/video-list'
  import VideoPlayer from '@/components/video/video-player'
  import RelatedProductDrawer from './components/related-product-drawer'
  import { VIDEO_STATUS } from '@/data/constants/video'
  import { fetchVideoList } from '@/data/repos/videoRepository'

  export default {
    name: 'video-center',
    components: { FileSelector, VideoList, VideoPlayer, RelatedProductDrawer },
    created () {
      this.timeout = null
      this.fetchVideoList()
    },
    beforeDestroy () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    },
    data () {
      return {
        PRODUCT_LIST_PAGE_NAME: productListPage.name,
        uploadProgress: 0, // 上传进度
        uploadFileList: [], // 正在上传的文件列表
        showUploadModal: false,
        showVideoModal: false,
        showProgressModal: false,
        usage: 0,
        loading: false,
        videoList: [],
        pageNum: 1,
        pageSize: 20,
        total: 0,
        previewVideo: null,
        relateVideo: null
      }
    },
    computed: {
      // 只要有正在上传的视频就说明是上传中的状态
      uploading () {
        return this.uploadFileList.length > 0
      },
      // 所有视频，包括正在上传的视频
      allVideoList () {
        return [...this.uploadFileList, ...this.videoList]
      }
    },
    filters: {
      floor (v) {
        return Math.floor(v)
      }
    },
    methods: {
      // 回到首页（商品列表）
      toHome () {
        jumpTo(productListPage.pages, {
          params: {
            wmPoiId: poiId
          }
        })
      },
      // 关闭视频预览
      closePreview () {
        this.previewVideo = null
      },
      // 关闭视频关联
      closeRelate () {
        this.relateVideo = null
      },
      // 视频预览
      preview (video) {
        this.previewVideo = video
      },
      // 视频关联
      relate (video) {
        this.relateVideo = video
      },
      fetchVideoList () {
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.loading = true
        fetchVideoList({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then(data => {
          const { usage, totalNum, list } = data
          this.usage = usage
          this.total = totalNum
          this.videoList = list
          // 有转码中的视频时，间隔5秒刷新数据
          const hasTranscodingVideo = list.some(v => v.status === VIDEO_STATUS.TRANSCODING)
          if (hasTranscodingVideo) {
            this.timeout = setTimeout(this.fetchVideoList, 10000)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 切换页
      handlePageChange (page) {
        this.pageNum = page
        this.fetchVideoList()
      },
      // 视频上传开始
      handleUploadStart (fileList) {
        this.showUploadModal = false
        this.showProgressModal = true
        this.uploadFileList = fileList || []
      },
      // 视频上传过程
      handleUploadProgress (event) {
        if (event) {
          this.uploadProgress = Math.floor(event.percent * 0.99)
        }
      },
      // 视频上传失败
      handleUploadError (error, message, file) {
        console.log('error:', error, message, file)
        const index = this.uploadFileList.findIndex(v => v === file)
        if (index >= 0) {
          this.uploadFileList.splice(index, 1)
        }
        this.$Message.warning(`${file.name} 上传失败`)
        // 当所有文件上传都结束上传后（无论是成功还是失败），自动关闭进度modal
        if (this.uploadFileList.length === 0) {
          this.showProgressModal = false
        }
      },
      // 视频上传成功
      handleUploadSuccess (response, file) {
        const index = this.uploadFileList.findIndex(v => v === file)
        if (index >= 0) {
          this.uploadFileList.splice(index, 1)
        }
        // 当所有文件上传都结束上传后（无论是成功还是失败），自动关闭进度modal
        if (this.uploadFileList.length === 0) {
          this.showProgressModal = false
        }
        // 上传成功后刷新列表
        const { code, msg } = response || {}
        if (code === 0) {
          this.fetchVideoList()
        } else {
          this.$Message.error(`视频 ${file.name} 上传失败：${msg}`)
        }
      },
      // 商品关联成功
      handleRelConfirm () {
        this.relateVideo = null
        this.fetchVideoList()
      }
    }
  }
</script>

<style scope lang="less">
  .video-center {
    color: @primary-color;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
      position: relative;
      flex: 1;
      background: #FFFFFF;
      box-shadow: 0 0 6px 0 #F3F3F4;
      border-radius: 2px;
      padding: 0 20px;
      .video-panel-header {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        padding: 20px 0;
        z-index: 2;
        &.border {
          border-bottom: 1px solid @border-color-base;
        }
        h3 {
          font-weight: bold;
          font-size: 20px;
          .count {
            font-weight: normal;
            font-size: 14px;
          }
        }
        .usage {
          color: @text-tip-color;
        }
      }
      .video-list-container {
        position: relative;
        padding: 0 0 10px;
      }
      .paging-container {
        text-align: right;
        padding-top: 10px;
        border-top: 1px solid @border-color-base;
      }
    }
  }
  .loading-container {
    position: relative;
    height: 100px;
  }
  .file-selector-container {
    width: 100%;
    max-width: 1000px;
    padding: 20px;
    margin: 0 auto;
  }
  .centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .upload-file-progress {
    margin-bottom: 20px;
    line-height: 1;
    .boo-progress-bg {
      background: @link-color;
    }
    .boo-progress-success .boo-progress-bg {
      background: @success-color;
    }
  }
</style>
