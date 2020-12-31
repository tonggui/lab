<template>
  <div class="product-video">
    <VideoBox
      :video="displayValue"
      :editable="!disabled"
      @del="handleDel"
      @edit="handleEdit"
      @add="showUploadModal"
    />
    <ul class="note" v-if="showNote">
      <li>1. 建议比例：1:1、3:4、16:9</li>
      <li>2. 文件格式：mp4(建议)、wmv、avi、mpg、mpeg、3gp、mov、flv、f4v、m4v、m2t、mts、rmvb、vob、mkv、webm</li>
      <li>3. 文件大小：选择本地视频≤200mb以内</li>
    </ul>
    <VideoEditModal
      title="编辑视频"
      :value="!!curEditVideo"
      :video="curEditVideo"
      edit-mode
      :disabled="disabled"
      @cancel="handleEdit(null)"
      @confirm="finishEdit"
    />
    <VideoListModal
      v-model="showVideoListModal"
      ref="videoListRef"
      :width="800"
      :on-file-upload-start="handleUploadStart"
      :on-file-upload-success="handleUploadSuccess"
      :on-file-upload-error="handleUploadError"
      @confirm="handleConfirm"
    />
    <Modal
      v-model="showProgressModal"
      :width="400"
      :closable="false"
    >
      <div class="progress-container">
        <iCircle v-if="uploadProgress" :percent="uploadProgress" :size="64" :stroke-color="progressColor" :stroke-width="5" :trail-width="5">
          <Icon v-if="uploadComplete" type="checked-thin" size="40" style="color:#5cb85c"></Icon>
          <span class="percent" v-else>{{ uploadProgress }}<span style="font-size: 12px">%</span></span>
        </iCircle>
        <div class="progress-tip">
          <h3>{{ progressTip }}</h3>
          <span v-if="!uploadComplete">请耐心等待</span>
        </div>
      </div>
      <template slot="footer">
        <Button type="primary" @click="showProgressModal = false">最小化至后台上传</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
  import VideoBox from './video-box'
  import VideoListModal from './video-list-modal'
  import VideoEditModal from './video-modal'
  import { convertProductVideoFromServer } from '@/data/helper/product/base/convertFromServer'
  import { fetchVideoStatus } from '@/data/repos/videoRepository'
  import { VIDEO_STATUS } from '@/data/constants/video'
  import ScopedLXDirectiveMixin from '@/mixins/lx'

  export default {
    name: 'product-video',
    components: { VideoBox, VideoListModal, VideoEditModal },
    mixins: [ScopedLXDirectiveMixin],
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
      },
      showNote: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      this._mounted = true
    },
    beforeDestroy () {
      this._mounted = false
    },
    data () {
      return {
        curEditVideo: null, // 当前编辑视频
        curEditName: '', // 当前编辑视频的名称
        uploadFileList: [], // 上传视频文件列表
        showVideoListModal: false, // 是否显示视频modal
        showProgressModal: false // 是否显示上传进度modal
      }
    },
    computed: {
      displayValue () {
        return this.uploadFileList[0] || this.value
      },
      uploadProgress () {
        return this.uploadFileList[0] ? Math.floor(this.uploadFileList[0].percentage * 0.99) : 0
      },
      uploadComplete () {
        return this.uploadProgress === 100
      },
      progressColor () {
        return this.uploadComplete ? '#5cb85c' : '#FFA530'
      },
      progressTip () {
        if (this.value && this.value.status === VIDEO_STATUS.TRANSCODING) {
          return '视频转码中'
        }
        return this.uploadComplete ? '上传完成' : '上传中...'
      }
    },
    watch: {
      showVideoListModal (v) {
        this.$emit(v ? 'start' : 'end')
      },
      showProgressModal (v) {
        this.$emit(v ? 'start' : 'end')
      },
      curEditVideo (v) {
        this.$emit(v ? 'start' : 'end')
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
      showUploadModal () {
        this.$lx.mc({ bid: 'b_shangou_online_e_e46lrbm0_mc' })
        this.showVideoListModal = true
      },
      // 视频上传开始
      handleUploadStart (fileList) {
        this.showVideoListModal = false
        this.showProgressModal = true
        this.uploadFileList = fileList || []
      },
      // 视频上传失败
      handleUploadError (error, message, file) {
        console.log('error:', error, message, file)
        this.$Message.warning(`${file.name} 上传失败`)
        this.showProgressModal = false
        // 清空fileList
        this.uploadFileList.splice(0, this.uploadFileList.length)
      },
      // 视频上传成功
      handleUploadSuccess (response, file) {
        // 上传成功后刷新列表
        const { code = 1, msg = '', data = [] } = response || {}
        if (code === 0) {
          const video = convertProductVideoFromServer(data[0])
          // 上传成功后视频进入转码状态并实时查询该视频转码状态
          video.status = VIDEO_STATUS.TRANSCODING
          // 视频上传成功后选中当前数据并立刻开始查询视频的转码状态，注意这里要手动把poster置为''，因此此时返回数据的poster对应的地址实际访问的话会是404，只有等真正转码成功后才会有数据
          this.handleChange({ ...video, poster: '' })
          this.getVideoStatus(video)
        } else {
          this.showProgressModal = false
          this.$Message.error(`视频 ${file.name} 上传失败：${msg}`)
        }
        // 清空fileList
        this.uploadFileList.splice(0, this.uploadFileList.length)
      },
      // 获取视频状态
      getVideoStatus (video) {
        fetchVideoStatus(video.id).then((data) => {
          // 页面卸载后不会再去执行下面的逻辑
          if (!this._mounted) return
          // 如果状态是正在转码，隔1秒之后再查。如果已转码完成，则进行编辑
          if (data === VIDEO_STATUS.TRANSCODING) {
            setTimeout(() => this.getVideoStatus(video), 1000)
          } else if (data === VIDEO_STATUS.SUCCESS) {
            // 转码成功后立即更新当前数据，并刷新列表
            const newVideo = { ...video, status: data }
            this.handleChange(newVideo)
            if (this.$refs.videoListRef) {
              this.$refs.videoListRef.getVideoList()
            }
            this.$Message.success('视频上传成功')
            if (this.showProgressModal) {
              this.showProgressModal = false
              this.handleEdit(newVideo)
            } else {
              this.$Modal.confirm({
                title: '视频上传完成，是否继续编辑？',
                okText: '继续编辑',
                cancelText: '直接保存',
                onOk: () => {
                  this.handleEdit(newVideo)
                }
              })
            }
          } else {
            // 转码失败
            this.showProgressModal = false
            this.handleChange({ ...video, status: data })
            this.$Message.warning('视频转码失败')
          }
        }).catch(err => {
          console.log(err.message)
          this.$Message.error(err.message || '视频转码失败')
          this.handleChange({ ...video, status: VIDEO_STATUS.TRANSCODE_ERROR })
        })
      },
      finishEdit (videoTitle) {
        if (!videoTitle) {
          this.$Message.warning('视频标题不能为空')
          return
        }
        this.handleChange({
          ...this.curEditVideo,
          title: videoTitle
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

  .progress-container {
    font-size: 12px;
    text-align: center;
    line-height: 1.75;
    display: flex;
    align-items: center;
    .percent {
      display: inline-block;
      margin-top: 2px;
      font-size: 14px;
      color: @link-color;
    }
    .progress-tip {
      margin-left: 20px;
      text-align: left;
      h3 {
        color: @primary-color;
        font-size: 18px;
        margin: 0;
      }
      span {
        font-size: 14px;
        color: @text-color-secondary;
      }
    }
  }
</style>
