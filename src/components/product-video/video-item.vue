<template>
  <div>
    <div class="video-item" :class="{ invalid: !isValid, active }" @click="select">
      <span class="checked" v-show="active && isValid">
        <Icon class="icon-check" type="check" :size="16" />
      </span>
      <div class="poster" :style="{ backgroundImage: `url(${value.poster})` }" />
      <div class="duration">{{ value.duration | duration }}</div>
      <div class="play-btn-wrapper" v-show="isValid">
        <PlayBtn :size="22" @click.stop="preview" />
      </div>
      <StatusTip showFullTip :video="value" v-if="!isValid" />
    </div>
    <div class="video-title">{{ value.title }}</div>
  </div>
</template>

<script>
  import { VIDEO_STATUS, MAX_RELATED_COUNT } from '@/data/constants/video'
  import StatusTip from './status-tip'
  import PlayBtn from '../video/play-btn'

  export default {
    name: 'video-item',
    components: { StatusTip, PlayBtn },
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      },
      active: Boolean
    },
    computed: {
      isValid () {
        const { status, relSpuList } = this.value
        return VIDEO_STATUS.SUCCESS === status && (!relSpuList || relSpuList.length < MAX_RELATED_COUNT)
      }
    },
    methods: {
      preview () {
        this.$emit('preview', this.value)
      },
      select () {
        if (this.isValid) {
          this.$emit('select', this.value)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .video-title {
    font-size: 12px;
    line-height: 2;
    color: @text-color-secondary;
  }
  .video-item {
    position: relative;
    display: inline-block;
    width: 100%;
    padding-top: 56%;
    background-color: rgba(0,0,0,.2);
    cursor: pointer;
    box-sizing: border-box;
    .checked {
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      width: 0;
      height: 0;
      border-width: 28px 0 0 28px;
      border-style: solid;
      border-color: @highlight-color transparent transparent;
      z-index: 1;
      .icon-check {
        font-size: 12px;
        position: absolute;
        right: 0;
        bottom: 12px;
      }
    }
    &.active {
      box-shadow: 0 0 0 1px @highlight-color;
    }
    &:hover {
      box-shadow: 0 0 0 1px @highlight-color;
    }
    &.invalid {
      box-shadow: none;
    }
    .duration {
      position: absolute;
      right: 5px;
      bottom: 5px;
      background: rgba(0, 0, 0, .6);
      color: #fff;
      font-size: 12px;
      padding: 2px 4px;
      line-height: 1.2;
      border-radius: 2px;
    }
    .poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .play-btn-wrapper {
      display: inline-block;
      position: absolute;
      left: 5px;
      bottom: 5px;
      line-height: 1;
      border-radius: 50%;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.18);
      &:hover {
        /deep/ .play-btn {
          background: lighten(@link-hover-color, 20%) !important;
        }
      }
    }
  }
</style>
