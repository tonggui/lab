<template>
  <div class="file-selector">
    <Upload
      multiple
      paste
      name="multipart"
      type="drag"
      :action="uploadUrl"
      :data="uploadQuery"
      class="upload"
      ref="upload"
      :before-upload="beforeUpload"
      :accept="fileType"
      :show-upload-list="false"
      v-bind="$attrs"
      >
      <div style="padding: 20px 0">
        <Icon type="cloud-upload" size="72" style="color: #989a9c"></Icon>
        <div class="notification">
          <h3>将视频文件拖拽到本区域即可上传</h3>
          <p>支持视频格式：mp4(建议)、wmv、avi、mpg、mpeg、3gp、mov、flv、f4v、m4v、m2t、mts、rmvb、vob、mkv、webm<br>建议比例：1:1 或者 16:9，单个视频大小200mb以内</p>
          <Button class="btn" type="primary" size="large">选择一个或多个文件</Button>
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
import { poiId } from '@/common/constants'

const maxSize = 200
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
  computed: {
    // 上传参数
    uploadQuery () {
      return {
        wmPoiId: poiId
      }
    }
  },
  methods: {
    beforeUpload (file) {
      const sizeValid = file.size / 1024 / 1024 < maxSize
      if (!sizeValid) {
        this.$Message.warning({
          content: `单个视频大小不能超过${maxSize}MB!`,
          duration: 4
        })
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
      background: @light-background;
      padding: 7% 0;
    }
  }
  .notification {
    h3 {
      margin: 2% 0;
      font-size: 20px;
    }
    p {
      font-size: 12px;
      color: @text-tip-color;
    }
    .btn {
      margin-top: 5.5%;
    }
  }
  .tip {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: @text-tip-color;
    margin-top: 5px;
  }
</style>
