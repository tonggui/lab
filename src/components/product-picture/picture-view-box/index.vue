<template>
  <div :class="['picture-view-box', { 'no-pic': isNoPicture }]" v-bind="$attrs" v-on="$listeners">
    <img v-lazy="src" v-if="!isNoPicture" />
    <Icon v-else local="picture" size="22" />
    <span class="picture-view-box-marker bottom-marker">
      <slot name="bottom-marker">
        <span v-if="bottomMarkerOption.visible" class="marker" :class="`is-${bottomMarkerOption.type}`">{{ bottomMarkerOption.content }}</span>
      </slot>
    </span>
    <span class="top-left-marker picture-view-box-marker">
      <slot name="top-left-marker">
        <span v-if="leftMarkerOption.visible" class="marker" :class="`is-${bottomMarkerOption.type}`">{{ leftMarkerOption.content }}</span>
      </slot>
    </span>
    <span class="top-right-marker picture-view-box-marker">
      <slot name="top-right-marker">
        <span v-if="rightMarkerOption.visible" class="marker" :class="`is-${bottomMarkerOption.type}`">{{ leftMarkerOption.content }}</span>
      </slot>
    </span>
  </div>
</template>

<script>
  import isString from 'lodash/isString'
  import isPlainObject from 'lodash/isPlainObject'

  export default {
    name: 'PictureViewBox',
    props: {
      src: String,
      leftMarker: [String, Object],
      rightMarker: [String, Object],
      bottomMarker: [String, Object]
    },
    computed: {
      isNoPicture () {
        return !this.src
      },
      leftMarkerOption () {
        return this.computeMarkerOption(this.leftMarker)
      },
      rightMarkerOption () {
        return this.computeMarkerOption(this.rightMarker)
      },
      bottomMarkerOption () {
        return this.computeMarkerOption(this.bottomMarker)
      }
    },
    methods: {
      computeMarkerOption (marker) {
        let content = ''
        let type = 'normal'
        if (isString(marker)) {
          content = marker
        } else if (isPlainObject(marker)) {
          content = marker.content
        }
        return {
          visible: !!content,
          content,
          type
        }
      }
    }
  }
</script>

<style lang="less">
  .picture-view-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    box-sizing: border-box;
    border: 1px solid @border-color-base;
    background: #fff;
    cursor: pointer;
    &.no-pic {
      background-color: @disabled-bg;
    }
    img {
      max-height: 100%;
      max-width: 100%;
      &[lazy=error] {
        background-color: @disabled-bg;
        width: 24px;
      }
    }
    &-marker {
      position: absolute;
      font-size: @font-size-small;
      color: #ffffff;
      text-align: center;
      line-height: 1;
      &.bottom-marker {
        bottom: 0;
        left: 0;
        right: 0;
        .marker {
          display: block;
          padding: 4px;
          &.is-danger {
            background: rgba(244, 113, 107, .9);
          }
          &.is-normal {
            background: rgba(63, 65, 86, .9);
          }
        }
      }
      &.top-left-marker {
        left: 0;
        top: 0;
        .marker {
          display: inline-block;
          padding: 2px;
          background: #63D29D;
        }
      }
      &.top-right-marker {
        top: 0;
        right: 0;
        .marker {
          display: inline-block;
          padding: 4px;
          background: rgba(0, 0, 0, .6);
          border-radius: 0 0 0 2px;
        }
      }
    }
  }
</style>
