<template>
  <div class="video-box" @click="handleClickEvent">
    <PictureBox
      :src="poster"
      :size="size"
      :tag="tag"
      tagPlacement="top-left"
      :viewMode="disabled || !!hasVideo"
      style="margin: 0"
      class="video-preview-box"
      @upload="handleUploadEvent"
    />
    <slot>
      <template v-if="hasVideo">
        <div class="video-duration" v-if="video.duration">{{ video.duration | duration }}</div>
        <StatusTip
          :video="video"
        />
        <div class="controls">
          <div class="btn" @click="del" v-if="!processing && !disabled">移除</div>
          <div class="btn" v-if="normal" @click="edit">{{ editable ? '编辑' : '预览' }}</div>
        </div>
      </template>
    </slot>
  </div>
</template>

<script>
  import { get } from 'lodash'
  import PictureBox from '../product-picture/picture-box'
  import { VIDEO_STATUS } from '@/data/constants/video'
  import StatusTip from './status-tip'

  export default {
    name: 'video-box',
    components: { PictureBox, StatusTip },
    props: {
      video: {
        type: Object,
        default () {
          return null
        }
      },
      status: {
        type: Number,
        default: VIDEO_STATUS.SUCCESS
      },
      size: {
        type: String,
        default: 'normal'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      progress: {
        type: Number,
        default: 0
      },
      tag: String,
      editable: Boolean,
      manual: Boolean
    },
    computed: {
      normal () {
        return this.video && (this.video.status === VIDEO_STATUS.SUCCESS || this.video.status === undefined)
      },
      poster () {
        return this.video ? (this.video.poster || '') : ''
      },
      processing () {
        return this.video && (this.video.status === VIDEO_STATUS.TRANSCODING || this.video.status === VIDEO_STATUS.UPLOADING)
      },
      hasVideo () {
        return get(this.video, 'status') !== undefined || get(this.video, 'id') !== undefined
      }
    },
    methods: {
      del () {
        if (this.normal && !this.manual) {
          this.$Modal.confirm({
            title: '提示',
            content: '确认删除此视频？',
            onOk: () => {
              this.$emit('del')
            }
          })
        } else {
          this.$emit('del')
        }
      },
      edit () {
        this.$emit('edit', this.video)
      },
      handleUploadEvent () {
        if (!this.disabled) {
          this.$emit('add')
        }
      },
      handleClickEvent () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="less" scoped>
  .video-box {
    position: relative;
    cursor: pointer;
    .video-preview-box {
      /deep/ .tag {
        background: #FF6A00;
        color: #FFFFFF;
        border-radius: 2px 0 0 0;
      }
    }
    .video-duration {
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-weight: 500;
      background: #626262;
      color: #fff;
      font-size: @font-size-small;
      padding: 0px 3px;
      line-height: 17px;
      border-radius: 2px;
    }
    .controls {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      border-radius: 0 1px 1px 0;
      background: rgba(0, 0, 0, .5);
      padding: 6px 0;
      color: #fff;
      text-align: center;
      font-size: @font-size-small;
      line-height: 1.2;
      display: none;
      z-index: 1;
      .btn {
        display: inline-block;
        flex: 1;
        border-right: 1px solid #fff;
        &:last-child {
          border-right: 0;
        }
      }
    }
    &:hover {
      .controls {
        display: flex;
      }
    }
  }
</style>
