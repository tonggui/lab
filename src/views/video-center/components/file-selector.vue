<template>
  <div class="file-selector">
    <Upload
      multiple
      paste
      type="drag"
      action="//jsonplaceholder.typicode.com/posts/"
      class="upload"
      :accept="fileType"
      >
      <div style="padding: 20px 0">
        <Icon type="cloud-upload" size="52" style="color: #989a9c"></Icon>
        <div class="notification">
          <h3>将视频文件拖拽到本区域即可上传</h3>
          <p>支持视频格式：mp4(建议)、wmv、avi、mpg、mpeg、3gp、mov、flv、f4v、m4v、m2t、mts、rmvb、vob、mkv、webm<br>建议比例：1:1 或者 16:9，拍摄时长≤60s，选择本地视频≥200mb以内</p>
          <Button class="btn" type="primary" size="large">选择文件</Button>
        </div>
      </div>
    </Upload>
    <div class="tip">
      <span>视频上传仅能上传到视频空间，审核通过后需要与商品关联</span>
      <span>不清楚怎样拍摄？<a href="https://collegewm.meituan.com/post/detail/677">点击查看教程</a></span>
    </div>
  </div>
</template>

<script>
const fileType = '.mp4, .wmv, .avi, .mpg, .mpeg, .3gp, .mov, .flv, .f4v, .m4v, .m2t, .mts, .rmvb, .vob, .mkv, .webm'
export default {
  name: 'file-selector',
  data () {
    return {
      fileType
    }
  },
  methods: {
    /* 阻止拖拽事件默认行为 */
    stopEvt (evt) {
      evt.preventDefault()
    },
    /* 拖拽选择文件 */
    dropSelectedFile (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      const fileList = evt.dataTransfer.files
      if (fileList.length > 1) {
        this.$toast.warn('一次仅支持选择一个文件')
        return
      }
      if (fileList.length !== 0) {
        this.$emit('change', fileList)
      }
    },
    /* 点击选择文件 */
    selectedFile (evt) {
      const fileList = evt.target.files
      this.$emit('change', fileList)
      evt.target.value = ''
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
  }
</style>
