<template>
  <div class="form-item-layout-wrapper" :class="{
    'hover-mode': hoverMode,
    'stay-mode': !hoverMode,
    'no-desc': !description,
    'no-label': !label,
    hide: !visible,
    error: displayError
  }">
    <div class="form-item-layout">
      <template v-if="hoverMode">
        <div v-if="label" class="label-container">
          <div class="label" :class="{ 'is-required': required }">
            <template v-if="isVueComponent(label)">
              <component :is="label" />
            </template>
            <template v-else>{{label}}</template>
          </div>
        </div>
        <div class="content">
          <slot />
        </div>
        <Tooltip
          placement="bottom"
          max-width="225px"
          :content="description"
        >
          <Icon class="tip" local="question-circle"/>
        </Tooltip>
      </template>
      <template v-else>
        <div v-if="label||description" class="label-container">
          <div class="label" :class="{ 'is-required': required }">
            <template v-if="isVueComponent(label)">
              <component :is="label" />
            </template>
            <template v-else>
              <span title="label" v-html="label"></span>
            </template>
          </div>
          <span v-if="description" class="description">
          <template v-if="isVueComponent(description)">
            <component :is="description" />
          </template>
          <template v-else>{{description}}</template>
        </span>
        </div>
        <div class="content">
          <slot />
        </div>
      </template>
    </div>
    <div class="error-tip" v-if="displayError">{{error}}</div>
  </div>
</template>

<script>
  import isVueComponent from 'is-vue-component'
  import isString from 'lodash/isString'
  import isEmpty from 'lodash/isEmpty'
  export default {
    name: 'FormItemLayout',
    props: {
      label: [String, Function, Object],
      required: Boolean,
      disabled: Boolean,
      visible: {
        type: Boolean,
        default: () => true
      },
      description: [String, Function, Object],
      hoverMode: Boolean,
      error: [String, Boolean],
      // 是否显示错误信息, 用户组件自控场景
      showError: {
        type: Boolean,
        default: () => true
      }
    },
    computed: {
      displayError () {
        return this.showError && isString(this.error) && !isEmpty(this.error)
      }
    },
    methods: {
      isVueComponent
    }
  }
</script>

<style scoped lang="less">
  @title-width: 90px;
  @item-height: 36px;

  .form-item-layout-wrapper {
    padding: 10px 20px 5px;
    &.stay-mode {
      .content {
        margin-left: @title-width;
        margin-top: 5px;
      }
      .error-tip {
        margin-left: @title-width;
      }
      &.no-desc {
        .label-container {
          padding-top: 8px;
        }
      }
    }
    &.hover-mode {
      .form-item-layout {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
      }

      .content {
        width: auto;
        min-height: @item-height;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: none;
      }

      .label-container
      ,.tip {
        padding-top: 8px;
        height: 20px;
        line-height: 20px;
      }
    }
    &.no-label {
      .content {
        margin-left: 0;
      }
      .error-tip {
        margin-left: 0;
      }
    }

    &.no-desc {
      .form-item-layout {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }

      .content {
        margin-top: 0;
        margin-left: 0;
      }
    }
    &.hide {
      display: none;
    }
    &.error {
      .content {
        /deep/ .boo-input,
        /deep/ .boo-select,
        /deep/ .withSearch,
        /deep/ .custom-selector {
          border: 1px solid @error-color;
        }
      }
    }
  }

  .form-item-layout {

  }

  .label-container {
    min-height: 20px;
    font-size: @font-size-small;
    line-height: 20px;
    letter-spacing: 0;
  }

  .label {
    position: relative;
    width: @title-width;
    display: inline-block;
    vertical-align: top;
    white-space: normal;
    padding-right: 10px;
    > span {
      /*max-width: 5em;*/
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      vertical-align: top;
    }
    /deep/ .boo-tooltip {
      line-height: 1;
    }
    &.is-required:after {
      position: absolute;
      content: '*';
      display: inline-block;
      margin-left: 2px;
      line-height: 1;
      font-size: 12px;
      top: 4px;
      color: @text-red;
    }
  }

  .description {
    color: @text-tip-color;
    vertical-align: top;
  }

  .content {
    flex: 1;
    max-width: 100%;
    line-height: @item-height;

    /deep/ .boo-input-wrapper, .boo-select {
      vertical-align: top;
    }

    /deep/ .boo-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .boo-checkbox-wrapper {
        margin-right: 16px;
      }
    }
  }

  .input {
    width: 440px;
    height: @item-height;
  }

  .tip {
    margin-left: 10px;
    cursor: pointer;
  }

  .error-tip {
    color: @error-color;
    font-size: 12px;
    line-height: 1;
    margin-top: 8px;
  }
</style>
