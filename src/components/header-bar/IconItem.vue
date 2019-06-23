<template>
  <Link
    class="nav-link"
    :to="menu.link||''"
    :disabled="!!menu.disabled"
    :data-lx="`moduleClick('${menu.bid}')`"
    @click="createCompatibleClickEventListener(menu.click)"
  >
    <template v-if="menu.children">
      <Dropdown trigger="hover">
        <Icon class="icon" v-bind="getIconProps(menu.icon)">
          <component v-if="isComponent(menu.icon)" :is="menu.icon" />
          <Badge v-if="badgeProps" v-bind="badgeProps" />
        </Icon>
        <div>
          {{menu.label}}
          <Icon type="keyboard-arrow-down" />
        </div>
        <DropdownMenu slot="list">
          <DropdownItem v-for="(subMenu, idx) in menu.children" :key="idx">
            <Link
              class="download-item-link"
              :to="subMenu.link||''"
              :disabled="!!subMenu.disabled"
              @click="createCompatibleClickEventListener(subMenu.click)"
              :data-lx="`moduleClick('${subMenu.bid}')`"
            >{{subMenu.label}}
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </template>
    <!-- eslint-disable-next-line vue/valid-template-root -->
    <template v-else>
      <Icon class="icon" v-bind="getIconProps(menu.icon)">
        <component v-if="isComponent(menu.icon)" :is="menu.icon" />
        <Badge v-if="badgeProps" v-bind="badgeProps" />
      </Icon>
      <div>{{menu.label}}</div>
    </template>
  </Link>
</template>

<script>
import Link from '@/components/link/link'
import menuItemMixins from './menuItemMixins'

export default {
  name: 'IconItem',
  mixins: [menuItemMixins],
  components: {
    Link
  }
}
</script>

<style scoped lang="less">
  .nav-link {
    display: block;
    cursor: pointer;
    min-width: 120px;
    line-height: 16px;
    text-align: center;
    font-size: @font-size-base;
    padding: 0;
    color: @text-color;
    .icon {
      font-size: 32px;
      color: @link-color;
      margin-bottom: 5px;
      position: relative;

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
