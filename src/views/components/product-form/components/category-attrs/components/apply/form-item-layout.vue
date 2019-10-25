<template>
  <div class="form-item-layout" :class="{ 'no-desc': !description, 'no-label': !label, hide: !visible }">
    <div v-if="label || description" class="label-container">
      <div class="label" :class="{ 'is-required': required }">
        <span title="label">{{label}}</span>
      </div>
      <span v-if="description" class="description">
        <template v-if="isVueComponent(description)">
          <component :is="description" />
        </template>
        <template v-else>{{description}}</template>
      </span>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script>
  import isVueComponent from 'is-vue-component'
  export default {
    name: 'FormItemLayout',
    props: {
      label: String,
      required: Boolean,
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
  @title-width: 85px;
  @item-height: 36px;

  .form-item-layout {
    padding: 10px 20px 5px;

    .content {
      margin-left: @title-width;
      margin-top: 5px;
    }
    &.no-desc {
      .label-container {
        height: @item-height;
        line-height: @item-height;
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
      /*max-width: 5em;*/
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
    }
    &.is-required:after {
      content: '*';
      display: inline-block;
      margin-left: 2px;
      line-height: 1;
      font-size: 12px;
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
  }
</style>
