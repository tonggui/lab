<template>
  <div class="status-tip" :class="{ error: !!errorText }" v-show="!normal" @click="handleClick">
    <template v-if="!!errorText">
      {{ errorText }}
    </template>
    <template v-else-if="transcoding">
      <div class="tip-content">
        <Icon type="loading" size="16" class="spin" />
        <span style="margin-left: 5px;">转码中</span>
      </div>
    </template>
    <template v-else-if="uploading">
      <div class="progress-container">
        <iCircle :percent="progress" :size="45" :stroke-color="progressColor" :stroke-width="5" :trail-width="5">
          <Icon v-if="progress == 100" type="checked-thin" size="40" style="color:#5cb85c"></Icon>
          <span class="percent" v-else>{{ progress }}%</span>
        </iCircle>
        <div>视频上传中</div>
      </div>
    </template>
  </div>
</template>

<script>
import { VIDEO_STATUS } from '../constant'

export default {
  name: 'status-tip',
  props: {
    video: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      VIDEO_STATUS
    }
  },
  computed: {
    normal () {
      return this.video.status === VIDEO_STATUS.SUCCESS
    },
    // 是否正在上传，上传时video对象其实是上传组件传入的file对象，也有status属性，此时status值为uploading
    uploading () {
      return this.video.status === 'uploading'
    },
    // 上传进度
    progress () {
      return Math.floor(this.video.percentage) || 0
    },
    progressColor () {
      let color = '#FFA530'
      if (this.progress === 100) {
        color = '#5cb85c'
      }
      return color
    },
    // 正在转码
    transcoding () {
      return this.video.status === VIDEO_STATUS.TRANSCODING
    },
    errorText () {
      let text = ''
      const { status } = this.video
      if (status === VIDEO_STATUS.ERROR) {
        text = '上传失败'
      } else if (status === VIDEO_STATUS.FROZEN) {
        text = '审核失败'
      } else if (status === VIDEO_STATUS.TRANSCODE_ERROR) {
        text = '转码失败'
      }
      return text
    }
  },
  methods: {
    handleClick (e) {
      let msg = ''
      if (this.transcoding) {
        msg = '视频转码中，请稍后'
        e.stopPropagation()
      } else if (this.video.status === VIDEO_STATUS.TRANSCODE_ERROR) {
        msg = '视频转码失败，无法播放'
        e.stopPropagation()
      }
      if (msg) {
        this.$Message.warning(msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

.status-tip {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .8);
  color: #fff;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.25;
  z-index: 1;
  cursor: pointer;
  &.error {
    color: @color-error;
  }
  .tip-content {
    display: flex;
    align-items: center;
  }
  .progress-container {
    font-size: 12px;
    text-align: center;
    line-height: 1.5;
    .percent {
      font-size: 14px;
    }
  }
}
</style>
