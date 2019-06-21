<template>
  <div class="file-selector">
    <Upload
      multiple
      paste
      name="multipart"
      type="drag"
      :action="uploadUrl"
      class="upload"
      ref="upload"
      :before-upload="beforeUpload"
      :accept="fileType"
      :show-upload-list="false"
      v-bind="$attrs"
      >
      <div style="padding: 20px 0">
        <Icon type="cloud-upload" size="52" style="color: #989a9c"></Icon>
        <div class="notification">
          <h3>将视频文件拖拽到本区域即可上传</h3>
          <p>支持视频格式：mp4(建议)、wmv、avi、mpg、mpeg、3gp、mov、flv、f4v、m4v、m2t、mts、rmvb、vob、mkv、webm<br>建议比例：1:1 或者 16:9，单个视频大小200mb以内</p>
          <Button class="btn" type="primary" size="large">选择文件</Button>
        </div>
      </div>
    </Upload>
    <!-- 由于缺少视频教程链接，暂时隐藏这块 -->
    <!-- <div class="tip">
      <span>视频上传仅能上传到视频空间，审核通过后需要与商品关联</span>
      <span>不清楚怎样拍摄？<a href="https://collegewm.meituan.com/post/detail/677" target="_blank">点击查看教程</a></span>
    </div> -->
  </div>
</template>

<script>
import { uploadUrl } from '@/data/api/videoApi'

const maxSize = 200
const maxCount = 5
const fileType = '.mp4, .wmv, .avi, .mpg, .mpeg, .3gp, .mov, .flv, .f4v, .m4v, .m2t, .mts, .rmvb, .vob, .mkv, .webm'
export default {
  name: 'file-selector',
  props: {
    onStart: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      fileType,
      uploadUrl
    }
  },
  methods: {
    beforeUpload (file) {
      const fileList = this.$refs.upload.fileList
      if (fileList.length > maxCount - 1) {
        this.$Message.warning(`每次最多上传${maxCount}个视频`)
        return false
      }
      const sizeValid = file.size / 1024 / 1024 < maxSize
      if (!sizeValid) {
        this.$Message.warning(`单个视频大小不能超过${maxSize}MB!`)
        return false
      }
      this.onStart(this.$refs.upload.fileList)
      return true
    }
  }
}
</script>

<style scope lang="less">
  .upload {
    .boo-upload-drag {
      background: @color-gray1;
      padding: 60px 0;
    }
  }
  .notification {
    h3 {
      font-size: 20px;
    }
    p {
      font-size: 12px;
      color: @color-weak;
    }
    .btn {
      margin-top: 20px;
    }
  }
  .tip {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: @color-weak;
    margin-top: 5px;
  }
</style>
