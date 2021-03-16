<template>
  <component :is="component" v-bind="tooltip">
    <Badge v-bind="badgeProps" class="link-item" :class="{ disabled: isDisabled }">
      <RouteLink
        class="nav-link"
        tag="Button"
        :to="menu.link||''"
        @click="handleClick($event, menu.bid)"
        :disabled="isDisabled"
      >
        <Icon class="icon" v-bind="getIconProps(icon)">
          <component v-if="isComponent(icon)" :is="icon" />
        </Icon>
        <div>{{menu.label}}</div>
      </RouteLink>
    </Badge>
  </component>
</template>

<script>
  import RouteLink from '@/components/link/link'
  import menuItemMixins from './menuItemMixins'

  export default {
    name: 'LinkItem',
    mixins: [menuItemMixins],
    components: {
      RouteLink
    }
  }
</script>

<style scoped lang="less">
  .link-item.disabled {
      &,
      .nav-link,
      .icon {
        color: @disabled-color;
        cursor: not-allowed;
      }
      /deep/ .boo-badge-count {
        background: @disabled-bg;
        color: @disabled-color;
      }
  }
  .nav-link {
    display: inline-block;
    color: @text-color;
    text-align: right;
    margin-left: 16px;
    font-size: @font-size-base;
    padding: 0;
    line-height: 32px;
    cursor: pointer;
    > span > * {
      display: inline;
    }

    .boo-icon {
      margin-right: 5px;
      color: #404157;
      // font-size: @line-height-computed;
      font-size: 19px;
    }
  }
  .boo-badge {
    /deep/ .boo-badge-count {
      height: 18px;
      line-height: 16px;
      padding: 0 4px;
      font-weight: 700;
    }

    &.line /deep/ .boo-badge-count {
      background: #fff;
      color: @error-color;
    }
  }
</style>
