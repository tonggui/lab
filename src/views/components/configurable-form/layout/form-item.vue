<template>
  <div class="form-item-layout" :class="{ inline, reverse }">
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
    </div>
  </div>
</template>
<script>
  import isVueComponent from 'is-vue-component'
  import { isObject } from 'lodash'

  export default {
    name: 'form-item-layout',
    props: {
      contentWidth: Number,
      inline: Boolean,
      labelPosition: {
        type: String,
        default: 'baseline',
        validator: (labelPosition) => {
          return ['baseline', 'top'].includes(labelPosition)
        }
      },
      label: [String, Function, Object],
      required: Boolean,
      disabled: Boolean,
      visible: {
        type: Boolean,
        default: () => true
      },
      description: [String, Function, Object],
      tip: String
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
      }
    }
  }
</style>
