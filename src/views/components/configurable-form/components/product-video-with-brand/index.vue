<template>
  <div class="brand-video">
    <Tooltip
      :always="popTipVisible"
      :disabled="!popTipVisible"
      class="brand-video-tip brand-style"
      placement="right"
    >
      <ProductVideo
        v-show="!brandMode"
        ref="uploadBox"
        :value="value"
        :disabled="disabled"
        :editable="!disabled"
        v-on="$listeners"
        :show-note="false"
      />
      <ProductVideoBox
        v-if="brandMode"
        :video="brandVideo"
        :editable="false"
        v-mv="{ bid: 'b_shangou_online_e_n7o0emkt_mv', show: true }"
        :disabled="!brandVideoEditable"
        manual
        tag="品牌商"
        @del="removeBrandVideo"
        @edit="handleBrandVideoBoxPreviewEvent"
      />
      <div slot="content" v-if="popTipVisible" class="brand-video-tip-content">
        <ProductVideoBox
          :video="brandVideo"
          tag="品牌商"
          size="small"
          @click="showVideoPreviewModal(brandVideo)"
          disabled
        />
        <div class="brand-video-tip-content-message">
          <div>品牌商提供优质视频，使用有利于销量提升。</div>
          <div style="text-align: right">
            <Button
              v-if="!isCreateMode"
              class="brand-style"
              type="secondary"
              size="small"
              v-mc="{ bid: 'b_shangou_online_e_d29wpeif_mc' }"
              @click="changeBrandVideoStatus(false)"
            >暂不使用</Button>
            <Button
              class="brand-style"
              type="primary"
              size="small"
              v-mc="{ bid: 'b_shangou_online_e_8yqw1vj9_mc' }"
              @click="selectBrandVideo(true)"
            >立即使用</Button>
          </div>
        </div>
      </div>
    </Tooltip>
    <div class="brand-switch-operations" v-if="switchTipVisible">
      <template v-if="brandVideoEditable">
        <template v-if="switchToUploadModeTipVisible">
          效果不好？<a @click="uploadVideo(true)" v-mc="{ bid: 'b_shangou_online_e_vkqfuwmu_mc' }">自行上传视频</a>
        </template>
        <template v-if="switchToBrandModeTipVisible">
          效果不好？<a @click="selectBrandVideo(true)" v-mc="{ bid: 'b_shangou_online_e_al0w5zqi_mc' }">使用品牌商视频</a>
        </template>
      </template>
    </div>
    <VideoPreviewModal
      :value="previewModalVisible"
      :video="previewVideo"
      disabled
      @cancel="previewModalVisible=false"
      @confirm="previewModalVisible=false"
    />
  </div>
</template>

<script>
  import get from 'lodash/get'
  import ScopedLXDirectiveMixin from '@/mixins/lx'
  import ProductVideo from '@/components/product-video'
  import ProductVideoBox from '@/components/product-video/video-box'
  import VideoPreviewModal from '@/components/product-video/video-modal'
  import PlayButton from '@/components/video/play-btn'

  export default {
    name: 'ProductVideoWithBrandVideo',
    components: {
      ProductVideo,
      ProductVideoBox,
      VideoPreviewModal
    },
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
      brandVideo: {
        type: Object,
        default () {
          return null
        }
      },
      // 0-未进行过操作，1-未启用，2-启用
      brandVideoStatus: {
        type: Number,
        default: 0
      },
      // 自动选择（未上传，且存在品牌商，自动选择品牌商视频）
      autoUse: Boolean,
      // 是否支持品牌商视频编辑
      brandVideoEditable: Boolean
    },
    data () {
      return {
        brandMode: false,
        autoMode: this.autoUse,
        previewModalVisible: false,
        previewVideo: null
      }
    },
    computed: {
      hasUploadVideo () {
        return get(this.value, 'status') !== undefined
      },
      brandVideoUsable () {
        return get(this.brandVideo, 'id') > 0
      },
      confirmed () {
        return this.brandVideoStatus !== 0
      },
      switchToBrandModeTipVisible () {
        return !this.isCreateMode && this.brandVideoUsable && !this.brandMode && this.confirmed
      },
      switchToUploadModeTipVisible () {
        return this.brandVideoUsable && this.brandMode
      },
      switchTipVisible () {
        return this.switchToBrandModeTipVisible || this.switchToUploadModeTipVisible
      },
      isCreateMode () {
        return this.autoUse
      },
      popTipVisible () {
        return !this.brandMode && this.brandVideoUsable && (
          this.isCreateMode || !this.confirmed
        )
      }
    },
    watch: {
      brandVideoStatus: {
        immediate: true,
        handler (v) {
          this.brandMode = v === 2
        }
      },
      autoUse (v) {
        this.autoMode = v
      },
      brandVideo () {
        if (this.autoMode) {
          if (!this.hasUploadVideo && this.brandVideoUsable) {
            this.changeBrandVideoStatus(true)
          }
        }
      }
    },
    methods: {
      uploadVideo (smart) {
        this.changeBrandVideoStatus(false)
        const showUploadBox = (smart && !this.hasUploadVideo) || !smart
        if (showUploadBox && this.$refs.uploadBox) {
          this.$refs.uploadBox.showUploadModal()
        }
      },
      changeBrandVideoStatus (isBrandMode) {
        // autoMode只启用一回，切换过立刻失效
        if (!isBrandMode) {
          this.autoMode = false
        }
        this.brandMode = isBrandMode
        this.$emit('videoModeChanged', isBrandMode ? 2 : 1)
      },
      async removeBrandVideo (confirm = this.autoMode) {
        this.$lx.mc({ bid: 'b_shangou_online_e_5hxhup85_mc' })
        if (confirm) {
          const isContinue = await new Promise(resolve => {
            this.$Modal.confirm({
              title: '确认移除视频吗？',
              content: '移除后该商品不再显示品牌商视频，但视频不被删除，仍可选择使用品牌商视频',
              onOk: () => resolve(true),
              onCancel: () => resolve(false)
            })
          })
          if (!isContinue) {
            return
          }
        }
        this.changeBrandVideoStatus(false)
      },
      async selectBrandVideo (confirm, preview = !this.autoUse) {
        if (confirm) {
          const isContinue = await new Promise(resolve => {
            const displayTextTip = !preview || this.hasUploadVideo
            const displayVideoBox = preview && !this.popTipVisible
            this.$Modal.confirm({
              title: '确认使用品牌商视频吗？',
              // content: '使用品牌商视频将覆盖当前已上传视频，是否使用？',
              onOk: () => resolve(true),
              onCancel: () => resolve(false),
              render: () => {
                return (
                  <div class="brand-modal-content">
                    {displayTextTip && <div class="brand-modal-content-text">使用品牌商视频将覆盖当前已上传视频，是否使用？</div>}
                    {displayVideoBox && (
                      <ProductVideoBox
                        video={this.brandVideo}
                        tag="品牌商"
                        disabled
                        vOn:click={() => this.showVideoPreviewModal(this.brandVideo)}
                      >
                        <PlayButton class="play-btn-cover-mode" />
                      </ProductVideoBox>
                    )}
                  </div>
                )
              }
            })
          })
          if (!isContinue) {
            return
          }
        }
        this.changeBrandVideoStatus(true)
      },
      handleBrandVideoBoxPreviewEvent () {
        this.$lx.mc({ bid: 'b_shangou_online_e_7jm15vyj_mc' })
        this.showVideoPreviewModal(this.brandVideo)
      },
      showVideoPreviewModal (video) {
        this.previewModalVisible = true
        this.previewVideo = video
      }
    }
  }
</script>

<style scoped lang="less">
.brand-video {
  .brand-video-tip {
    /deep/ .boo-tooltip-popper {
      z-index: 1000;
      margin-left: 10px;
    }
    /deep/ .boo-tooltip-inner {
      max-width: 456px;
    }
    .brand-video-tip-content {
      display: flex;
      width: 400px;
      flex-direction: row;

      .brand-video-tip-content-message {
        margin-left: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 12px;
        color: #555555;
        letter-spacing: 0;
        line-height: 16px;
      }
      .boo-btn {
        margin-left: 10px;
      }

      /deep/ .pic-container {
        border-width: 0px !important;
      }
    }
  }
  .brand-switch-operations {
    margin-top: 8px;
    font-size: 12px;
    line-height: 16px;
    color: #999;
  }
}
.brand-modal-content {
  color: @color-gray1;
  text-align: center;

  .brand-modal-content-text {
    text-align: left;
  }

  /deep/ .video-box {
    margin-top: 16px;
    display: inline-block;
  }
}
.play-btn-cover-mode {
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0;
  color: #fff;
}
</style>
