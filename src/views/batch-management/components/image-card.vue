<template>
  <div
    class="image-card"
    :class="{ 'is-disabled': disabled, 'is-checked': checked, 'is-img': mode === cardTypes.Image }"
    v-on="$listeners"
  >
    <div class="image-card-header">
      <h4>
        <slot name="header" />
        <Tooltip
          v-if="tips"
          :content="tips"
          :always="showTips"
          placement="top"
        >
          <Icon type="help"/>
        </Tooltip>
      </h4>
      <Icon v-if="checked" class="checked-icon" type="check"/>
      <div v-if="mode === cardTypes.Text" class="image-card-desc">
        <slot name="desc" />
      </div>
    </div>
    <div class="image-card-content">
      <slot name="content" />
    </div>
    <div v-if="mode === cardTypes.Image" class="image-card-desc">
      <slot name="desc" />
    </div>
  </div>
</template>

<script>
  const ImageCardTypes = Object.freeze({
    Text: 'text',
    Image: 'img'
  })
  export default {
    name: 'ImageCard',
    props: {
      disabled: Boolean,
      checked: Boolean,
      mode: {
        type: String,
        default: () => ImageCardTypes.Text,
        validate: (v) => Object.values(ImageCardTypes).includes(v)
      },
      tips: String
    },
    data () {
      return {
        showTips: false
      }
    },
    computed: {
      cardTypes () {
        return ImageCardTypes
      }
    }
  }
</script>

<style scoped lang="less">
  .image-card {
    background: @component-bg;
    border: 1px solid @border-color-base;
    border-radius: 2px;
    padding: 15px;
    position: relative;
    width: 180px;
    margin-right: 15px;
    cursor: pointer;
    transition: all .2s ease;

    &:not(.is-disabled):not(.is-checked):hover {
      border-color: rgba(65, 65, 86, 0.3);
    }

    .checked-icon {
      position: absolute;
      top: 2px;
      right: 1px;
      color: #fff;
      font-size: 12px;
      z-index: 10;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: 0px;
      width: 0px;
      border-top: 28px solid transparent;
      border-left: 28px solid transparent;
      pointer-events: none;
    }

    &:not(.is-disabled).is-checked {
      border-color: #F49B00;

      &::after {
        border-top-color: #F49B00;
      }
    }

    &.is-disabled {
      cursor: not-allowed;

      * {
        color: @disabled-color !important;
      }
    }

    &.is-checked.is-disabled {
      &::after {
        border-top-color: @border-color-base;
        opacity: .6;
      }
    }

    &.is-img {
      text-align: center;

      .header {
        border-bottom: none;
        padding-bottom: 5px;
      }

      .desc {
        height: auto;
      }

      .content {
        padding: 0;
      }
    }
  }

  &-desc {
    height: 3em;
  }

  &-header {
    border-bottom: 1px solid @border-color-base;
    font-size: @font-size-small;
    color: @text-color-secondary;
    padding-bottom: 15px;

    h4 {
      font-weight: bold;
      font-size: @btn-font-size;
      color: @text-color;
      margin-bottom: 7px;
    }
  }

  &-content {
    font-size: @font-size-small;
    color: @text-description-color;
    padding: 15px 0;
  }

  .tips-icon {
    margin-left: 5px;
    color: @text-color-secondary;
  }
</style>
