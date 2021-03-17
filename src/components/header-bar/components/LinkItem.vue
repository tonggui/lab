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
    font-size: 12px;
    color: #222222;
    text-align: left;
    margin-right: 16px;
    padding: 0;
    cursor: pointer;
    height: 100%;

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
      height: 16px;
      line-height: 13px;
      padding: 0 4px;
      top: -4px;
    }

    &.line /deep/ .boo-badge-count {
      background: #fff;
      color: @error-color;
    }
  }
</style>
