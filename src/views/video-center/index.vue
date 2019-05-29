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
          <div class="usage">已用 6.0M/2G</div>
        </div>
        <Button size="large" type="primary" @click="showUploadModal = true">上传视频</Button>
      </div>
      <div class="file-selector-container">
        <file-selector></file-selector>
      </div>
      <div class="video-list">
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
  </div>
</template>

<script>
import FileSelector from './components/file-selector'

export default {
  name: 'video-center',
  components: { FileSelector },
  data () {
    return {
      showUploadModal: false,
      loading: false,
      videoList: [],
      total: 100
    }
  }
}
</script>

<style scope lang="less">
  .video-center {
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
      padding: 20px;
      .video-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
      .video-list {
        padding: 5px;
      }
    }
  }
  .file-selector-container {
    width: 100%;;
    max-width: 800px;
    padding: 20px;
    margin: 0 auto;
  }
</style>
