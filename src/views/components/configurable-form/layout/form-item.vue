<template>
  <div class="form-item-layout" :class="{ inline, reverse, error: showError && error }">
    <div v-if="label" class="label" :class="{ 'is-required': required, top: labelPosition === 'top' }">
      <template v-if="isVueComponent(label)">
        <component :is="label" />
      </template>
      <template v-else>
        <span title="label" v-html="label"></span>
      </template>
    </div>
    <div class="content-container" :class="{ reverse }">
      <div class="content" :style="{ width: `${contentWidth}px` }">
        <slot />
        <Tooltip v-if="tip" type="help" :content="tip" />
      </div>
      <span v-if="description" class="description">
        <template v-if="isVueComponent(description)">
          <component :is="description" />
        </template>
        <template v-if="isObject(description)">
          <p :key="index" v-for="(text, index) in description.message" :class="{ inline: index === description.message.length - 1 }">
            {{ text }}
          </p>
          <a v-if="description.link" v-bind="description.link" class="description-link">{{ description.link.text }}</a>
          <Tooltip v-if="description.tip" type="help" :content="description.tip" />
        </template>
        <template v-else>
          <span>{{ description }}</span>
        </template>
      </span>
      <div class="error-tip" v-if="showError && error">{{error}}</div>
    </div>
  </div>
</template>
<script>
  import isVueComponent from 'is-vue-component'
  import { isObject } from 'lodash'

  /**
   * 参考 src/views/components/product-form/form-item-layout.vue
   */
  export default {
    name: 'form-item-layout',
    props: {
      contentWidth: Number, // 字面意思
      inline: Boolean, // 行内还是块
      labelPosition: { // lable 的位置，控制一下和description的对齐
        type: String,
        default: 'baseline',
        validator: (labelPosition) => {
          return ['baseline', 'top'].includes(labelPosition)
        }
      },
      // label，支持传入 vue 组件
      label: [String, Function, Object],
      // 是否必须，控制*
      required: Boolean,
      // 描述，支持一段文字，组件，配置 { message, link, placement }
      description: [String, Function, Object],
      // 小问号，提示
      tip: String,
      // 错误文案
      error: String,
      // 是否展示错误文案
      showError: Boolean
    },
    computed: {
      reverse () {
        if (!isObject(this.description)) {
          return false
        }
        return this.description.placement === 'top'
      }
    },
    methods: {
      isVueComponent,
      isObject
    }
  }
</script>
<style lang="less" scoped>
  @label-width: 55px;
  @item-height: 36px;

  .form-item-layout {
    padding: 10px 0px 5px;
    &.error .content {
      /deep/ .boo-input,
      /deep/ .boo-select,
      /deep/ .custom-selector,
      /deep/ .tag-with-sugguest-poptip .input-box,
      /deep/ .tag-list-poptip .input-box,
      /deep/ .withSearch {
        border: 1px solid @error-color;
      }
    }
    &.inline {
      display: inline-block;
    }
    &.reverse {
      .label {
        padding-top: 0;
      }
      .description {
        margin-bottom: 8px;
        margin-top: 0;
      }
    }
    .error-tip {
      color: @error-color;
      font-size: 12px;
      line-height: 1;
      margin-top: 8px;
    }
    .label {
      display: inline-block;
      vertical-align: top;
      width: @label-width;
      margin-right: 15px;
      padding-top: 10px;
      text-align: right;
      font-size: @font-size-small;
      line-height: 16px;
      letter-spacing: 0;
      word-break: break-all;
      white-space: normal;
      &.is-required::before {
        display: inline-block;
        content: '*';
        color: @error-color;
      }
      &.top {
        padding-top: 0;
      }
    }
    .content-container {
      flex: 1;
      display: inline-flex;
      flex-direction: column;
      max-width: calc(100% - @label-width);
      &.reverse {
        flex-direction: column-reverse;
      }
    }
    .content {
      line-height: @item-height;
      max-width: 100%;
    }
    .description {
      font-size: @font-size-small;
      color: @text-tip-color;
      line-height: 1.5;
      margin-bottom: 0;
      margin-top: 8px;
      .inline {
        display: inline-block;
      }
      .description-link {
        margin-left: 4px;
        text-decoration: underline;
      }
    }
  }
</style>
