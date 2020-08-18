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
      <template v-if="menu.children">
        <Dropdown trigger="hover">
          <Icon :class="{ active: menu.active }" class="icon" v-bind="getIconProps(icon)">
            <component v-if="isComponent(icon)" :is="icon" />
            <Badge v-if="badgeProps" v-bind="badgeProps" />
          </Icon>
          <div>
            {{menu.label}}
            <Icon type="keyboard-arrow-down" />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(subMenu, idx) in menu.children" :key="idx">
              <RouteLink
                class="download-item-link"
                tag="a"
                :to="subMenu.link||''"
                :disabled="!!subMenu.disabled"
                @click="handleClick($event, subMenu.bid)"
              >{{subMenu.label}}
              </RouteLink>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </template>
      <template v-else>
        <Icon class="icon" :class="{ active: menu.active }" v-bind="getIconProps(icon)">
          <component v-if="isComponent(icon)" :is="icon" />
          <Badge v-if="badgeProps" v-bind="badgeProps" />
        </Icon>
        <div>{{menu.label}}</div>
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
    display: block;
    cursor: pointer;
    line-height: 16px;
    text-align: center;
    font-size: @font-size-base;
    padding: 0;
    margin-right: 16px;
    color: @text-color;
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
      font-size: 32px;
      color: @link-color;
      margin-bottom: 5px;
      position: relative;
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
  }

  .download-item-link {
    color: @text-color;
    font-size: @font-size-base;
    padding: 0;
  }
</style>
