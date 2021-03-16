<template>
  <RouteLink
    tag="a"
    class="nav-link"
    :class="{ disabled: isDisabled }"
    :to="menu.link||''"
    :disabled="isDisabled"
    :delay="30"
    @click="handleClick($event, menu.bid)"
  >
    <component :is="component" v-bind="tooltip">
      <template >
        <Icon class="icon" :class="{ active: menu.active }" v-bind="getIconProps(icon)">
          <component v-if="isComponent(icon)" :is="icon" />
          <Badge v-if="badgeProps" v-bind="badgeProps" />
        </Icon>
        <div class="icon-title">
          <div class="icon-lable">{{menu.label}}</div>
          <div class="icon-description">{{menu.description}}</div>
        </div>
      </template>
    </component>
  </RouteLink>
</template>

<script>
  import RouteLink from '@/components/link/link'
  import menuItemMixins from './menuItemMixins'

  export default {
    name: 'IconItem',
    mixins: [menuItemMixins],
    components: {
      RouteLink
    }
  }
</script>

<style scoped lang="less">
  .nav-link {
    display: inline-block;
    cursor: pointer;
    line-height: 16px;
    font-size: @font-size-base;
    padding: 0;
    color: @text-color;
    min-width: 162px;
    &.disabled {
      &,
      .icon,
      .icon.active {
        color: @disabled-color;
        cursor: not-allowed;
      }
      /deep/ .boo-badge-count {
        background: @disabled-bg;
        color: @disabled-color;
      }
    }

    .icon {
      font-size: 34px;
      color: @link-color;
      margin-bottom: 5px;
      position: relative;
      top: -7px;
      &.active {
        color: @error-color;
      }

      .boo-badge {
        position: absolute;
        transform: translate(40%, -40%);
        right: 0;
        top: 0;

        /deep/ .boo-badge-count {
          height: 18px;
          line-height: 16px;
          padding: 0 4px;
          font-weight: 700;
        }
        /deep/ .boo-badge-dot {
          top: 2px;
          right: -2px;
        }

        &.line /deep/ .boo-badge-count {
          background: #fff;
          color: @error-color;
        }
      }
    }
    .icon-title {
      display: inline-block;
      width: 120px;
      margin-left: 8px;

      .icon-lable {
        font-weight: 500;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #000000;
        line-height: 14px;
        margin-bottom: 8px;
      }

      .icon-description {
        font-weight: 400;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        line-height: 12px;
      }
    }
  }

  .download-item-link {
    color: @text-color;
    font-size: @font-size-base;
    padding: 0;
  }
</style>
