<template>
  <div class="text-container">
    <div class="text" :style="textStyles" :data-line="line" :class="{ 'with-overflow-icon': showIcon }" ref="text">
      <slot name="text">{{ text }}</slot>
    </div>
    <div class="text-overflow-icon" v-if="showIcon">
      <Tooltip transfer :max-width="200">
        <Icon size="16" local="file" class="file-icon" />
        <span slot="content" class="text-tooltip-content">{{ text }}</span>
      </Tooltip>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'text-overflow-ellipsis',
    props: {
      line: {
        type: Number,
        default: 1
      },
      text: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        showIcon: false
      }
    },
    computed: {
      textStyles () {
        if (this.line === 1) {
          return {}
        }
        return {
          '-webkit-line-clamp': this.line
        }
      }
    },
    watch: {
      text () {
        this.showIcon = this.overflow()
      }
    },
    methods: {
      overflow () {
        let $text = this.$refs.text
        if (!$text) {
          return false
        }
        return $text.scrollWidth > $text.clientWidth || $text.scrollHeight > $text.clientHeight
      }
    },
    mounted () {
      this.showIcon = this.overflow()
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/styles/common.less";
  .text-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    .text {
      color: #333333;
      &.with-overflow-icon {
        padding-right: 16px;
      }
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:not([data-line='1']) {
        white-space: normal;
        display: -webkit-box;
        /*! autoprefixer: ignore next */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    .text-overflow-icon {
      position: absolute;
      right: 0;
      bottom: 0;
      .file-icon {
        color: #D9D9D9;
        &:hover {
          color: #3F4156;
        }
      }
    }
    .text-tooltip-content {
      white-space: normal;
      word-break: break-all;
    }
  }
</style>
