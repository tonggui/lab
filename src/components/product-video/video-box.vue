<template>
  <div class="video-box">
    <PictureBox
      :disabled="disabled"
      :src="poster"
      :size="size"
      :viewMode="!!video"
      style="margin: 0"
      @click="$listeners.add"
    />
    <template v-if="video">
      <div class="video-duration" v-if="video.duration">{{ video.duration | duration }}</div>
      <StatusTip
        :video="video"
      />
      <div class="controls">
        <div class="btn" @click="del" v-if="!processing">删除</div>
        <div class="btn" v-if="normal" @click="edit">编辑</div>
      </div>
    </template>
  </div>
</template>

<script>
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
      }
    },
    computed: {
      normal () {
        return this.video && (this.video.status === VIDEO_STATUS.SUCCESS || this.video.status === undefined)
      },
      poster () {
        return this.video ? (this.video.poster || 'none') : ''
      },
      processing () {
        return this.video && (this.video.status === VIDEO_STATUS.TRANSCODING || this.video.status === VIDEO_STATUS.UPLOADING)
      }
    },
    methods: {
      del () {
        if (this.normal) {
          this.$Modal.confirm({
            title: '确认删除此视频？',
            content: '',
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
      }
    }
  }
</script>

<style lang="less" scoped>
  .video-box {
    position: relative;
    cursor: pointer;
    .video-duration {
      position: absolute;
      right: 5px;
      bottom: 5px;
      background: rgba(0, 0, 0, .6);
      color: #fff;
      font-size: @font-size-small;
      padding: 2px 4px;
      line-height: 1.2;
      border-radius: 2px;
    }
    .controls {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .6);
      color: #fff;
      text-align: center;
      font-size: @font-size-small;
      line-height: 1.2;
      display: none;
      z-index: 1;
      .btn {
        padding: 6px 0;
        display: inline-block;
        flex: 1;
        border-right: 1px solid rgba(255, 255, 255, .2);
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
