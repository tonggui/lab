<template>
  <div class="card" :class="{ 'no-padding': contentNoPadding, 'has-shadow': hasShadow }">
    <div class="header" :class="{ sticky: headerSticky, inline }">
      <slot name="header" v-if="header"/>
      <template v-else>
        <div class="title">{{title}}</div>
        <div class="title-tip" v-if="tip">
          <template v-if="isVueComponent(tip)">
            <component :is="tip" />
          </template>
          <template v-else>{{tip}}</template>
        </div>
      </template>
    </div>
    <slot name="default" />
  </div>
</template>

<script>
  import isVueComponent from 'is-vue-component'
  export default {
    name: 'FormCard',
    props: {
      title: {
        type: String,
        required: true
      },
      tip: [String, Object, Function],
      contentNoPadding: Boolean,
      headerSticky: Boolean,
      header: Function,
      hasShadow: Boolean,
      inline: {
        type: Boolean,
        default: () => true
      }
    },
    methods: {
      isVueComponent
    }
  }
</script>

<style scoped lang="less">
  .card {
    background: @component-bg;
    border-radius: 2px;

    &.has-shadow {
      box-shadow: 0 0 6px 0 @box-shadow-base;
    }

    .header {
      padding: 20px;
      background-color: rgba(255, 255, 255, .85);

      &.inline {
        height: 60px;
        display: flex;
        align-items: center;

        .title-tip {
          margin-left: 15px;
          margin-top: 0;
        }
      }

      &.sticky {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    }

    .title {
      color: @primary-color;
      line-height: 20px;
      font-weight: bold;
    }

    .title-tip {
      font-size: @font-size-small;
      color: @text-tip-color;
      letter-spacing: 0;
      line-height: 20px;
      margin-top: 10px;
    }

    .content {
      padding: 0 20px 20px 20px;
    }

    + .card {
      margin-top: 10px;
    }

    &.no-padding {
      .content {
        padding: 0;
      }
    }
  }
</style>
