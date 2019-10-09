<template>
  <component :is="component" v-bind="tooltip">
    <Badge v-bind="badgeProps">
      <RouteLink
        class="nav-link"
        tag="Button"
        :to="menu.link||''"
        @click="handleClick"
        :disabled="!!menu.disabled"
        :data-lx="`moduleClick('${menu.bid}')`"
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
  import TooltipWithLocalstorage from '@components/tooltip-with-localstorage'

  export default {
    name: 'LinkItem',
    mixins: [menuItemMixins],
    computed: {
      component () {
        const { tooltip } = this.menu
        if (tooltip && tooltip.keyName) {
          return TooltipWithLocalstorage
        }
        if (tooltip) {
          return 'Tooltip'
        }
        return 'span'
      },
      tooltip () {
        const { tooltip } = this.menu
        return tooltip || {}
      }
    },
    components: {
      RouteLink,
      TooltipWithLocalstorage
    }
  }
</script>

<style scoped lang="less">
  .nav-link {
    display: inline-block;
    color: @text-color;
    text-align: right;
    margin-left: 36px;
    font-size: @font-size-base;
    padding: 0;
    line-height: 32px;
    > span > * {
      display: inline;
    }

    .boo-icon {
      margin-right: 5px;
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
