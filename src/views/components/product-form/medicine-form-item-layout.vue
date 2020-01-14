<template>
  <div class="form-item-layout" :class="{ 'no-desc': !description, 'no-label': !label, hide: !visible }">
    <div v-if="label||description" class="label-container">
      <div class="label" :class="{ 'is-required': required }">
        <span title="label" v-html="label"></span>
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
  </div>
</template>

<script>
  import isVueComponent from 'is-vue-component'
  export default {
    name: 'FormItemLayout',
    props: {
      label: String,
      required: Boolean,
      disabled: Boolean,
      visible: {
        type: Boolean,
        default: () => true
      },
      description: [String, Function, Object]
    },
    methods: {
      isVueComponent
    }
  }
</script>

<style scoped lang="less">
  @title-width: 100px;
  @item-height: 36px;

  .form-item-layout {
    padding: 10px 20px 5px;
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
    padding-top: 8px;
    margin-right: 10px;
  }

  .label {
    position: relative;
    width: @title-width;
    display: inline-block;
    vertical-align: top;
    white-space: normal;
    padding-right: 10px;
    text-align: right;
    > span {
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
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

  .content {
    flex: 1;
    max-width: 100%;
    line-height: @item-height;
    margin-left: @title-width;
    margin-top: 5px;

    /deep/ .boo-input-wrapper, .boo-select {
      vertical-align: top;
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
</style>
