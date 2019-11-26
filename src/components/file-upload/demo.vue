<template>
  <div style="background: #fff">
    <p>默认场景</p>
    <FileUpload @submit="handleSubmit1" />
    <p>上传 throw error 错误</p>
    <FileUpload @submit="handleSubmit2" />
    <p>上传等待</p>
    <FileUpload @submit="handleSubmit3" />
    <p>上传错误</p>
    <FileUpload @submit="handleSubmit4" />
    <p>form 上传</p>
    <FileUpload @submit="handleSubmit1" :inline-upload="false"  />
  </div>
</template>
<script>
  import FileUpload, { UPLOAD_STATUS } from './index'

  export default {
    name: 'file-upload-demo',
    components: {
      FileUpload
    },
    methods: {
      async handleSubmit2 () {
        throw Error('错误')
      },
      handleSubmit1 () {
        return UPLOAD_STATUS.SUCCESS
      },
      handleSubmit3 () {
        return UPLOAD_STATUS.PENDING
      },
      handleSubmit4 () {
        return UPLOAD_STATUS.ERROR
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
