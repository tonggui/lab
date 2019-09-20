<template>
  <div class="upload-box">
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
      :accept="accept"
      :show-upload-list="false"
      v-bind="$attrs"
      >
      fff
    </Upload>
  </div>
</template>

<script>
  import { uploadUrl } from '@/data/api/videoApi'

  export default {
    name: 'upload-box',
    props: {
      accept: {
        type: String,
        default: 'image/*'
      }
    },
    data () {
      return {
        filename: ''
      }
    },
    computed: {
      uploadUrl () {
        return uploadUrl
      },
      // 上传参数
      uploadQuery () {
        return {
          picName: this.filename,
          picAudit: false
        }
      }
    }
  }
</script>
