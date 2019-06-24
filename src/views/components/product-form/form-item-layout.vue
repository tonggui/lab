<template>
  <div class="form-item" :class="{ 'hover-mode': hoverMode, 'stay-mode': !hoverMode, 'no-desc': !description, 'no-label': !label, hide: !visible }">
    <template v-if="hoverMode">
      <div v-if="label" class="label-container">
        <div class="label" :class="{ 'is-required': required }">
          <span title="label">{label}</span>
        </div>
      </div>
      <div class="content"><slot /></div>
      <Tooltip
        placement="bottom"
        max-width="225px"
        :content="description"
      >
        <Icon class="tip" local="question-circle"/>
      </Tooltip>
    </template>
    <template v-esle>
      <div v-if="label||description" class="label-container">
        <div class="label" :class="{ 'is-required': required }">
          <span title="label">{label}</span>
        </div>
        <span v-if="description" class="description">{{description}}</span>
      </div>
      <div class="content"><slot /></div>
    </template>
  </div>
</template>

<script>
import Tooltip from '@sfe/bootes/src/basics/components/tooltip/tooltip'
export default {
  name: 'FormItemLayout',
  components: { Tooltip },
  props: {
    label: String,
    required: Boolean,
    visible: {
      type: Boolean,
      default: () => true
    },
    description: [String, Function],
    hoverMode: Boolean
  }
}
</script>

<style scoped lang="less">
  @title-width: 70px;

  .form-item {
    padding: 10px 0 5px 0;

    &.stay-mode {
      .content {
        margin-left: @title-width;
        margin-top: 5px;
      }
      &.no-desc {
        .label-container {
          height: 36px;
          line-height: 36px;
        }
      }
    }

    &.hover-mode {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;

      .content {
        width: auto;
        min-height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        flex: none;
      }

      .label-container
      ,.tip {
        height: 36px;
        line-height: 36px;
      }
    }
    &.no-label {
      .content {
        margin-left: 0;
      }
    }

    &.no-desc {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .content {
        margin-top: 0;
        margin-left: 0;
      }
    }
    &.hide {
      display: none;
    }
  }

  .label-container {
    min-height: 20px;
    font-size: @font-size-small;
    line-height: 20px;
    letter-spacing: 0;
  }

  .label {
    width: @title-width;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    padding-right: 4px;
    > span {
      max-width: 5em;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
    }
  @mixin required after,\00a0;
    &.is-required {
    @mixin required after;
    }
  }

  .description {
    color: @description-color;
    vertical-align: top;
  }

  .content {
    flex: 1;
    max-width: 100%;
    > :global(.ant-input) {
      width: 440px;
      height: 36px;
    }
    > :global(textarea.ant-input) {
      height: auto;
      min-height: 77px;
    }
    :global(.anticon-close-circle)
    , :global(.ant-input-clear-icon){
      color: @icon-color;
    }
    :global {
      .ant-input-affix-wrapper {
        .ant-input-clear-icon {
          display: none;
        }
        &:hover {
          .ant-input-clear-icon {
            display: inline-block;
          }
        }
      }
    }
  }

  .input {
    width: 440px;
    height: 36px;
  }

  .tip {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
