<template>
  <div class="wrapper">
    <div class="left">
      <NamedLink
        class="nav-link"
        v-for="(menu, index) in leftMenus"
        :key="index"
        :name="menu.link"
        :data-lx="`moduleClick('${menu.bid}')`"
      >
        <template v-if="menu.subs">
          <Dropdown trigger="hover">
            <Icon class="icon"><component :is="menu.icon" /></Icon>
            <div>
              {{menu.label}}
              <Icon type="keyboard-arrow-down" />
            </div>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(subMenu, idx) in menu.subs" :key="idx">
                <NamedLink
                  :name="subMenu.link"
                  class="download-item-link"
                  :data-lx="`moduleClick('${subMenu.bid}')`"
                >{{subMenu.label}}</NamedLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
        <template v-else>
          <Icon class="icon"><component :is="menu.icon" /></Icon>
          <div>{{menu.label}}</div>
        </template>
      </NamedLink>
    </div>
    <div class="right">
      <NamedLink
        class="nav-link"
        v-for="(menu, index) in rightMenus"
        :key="index"
        :name="menu.link"
        :data-lx="`moduleClick('${menu.bid}')`"
      >
        <Icon class="icon"><component :is="menu.icon" /></Icon>
        <div>{{menu.label}}</div>
      </NamedLink>
    </div>
  </div>
</template>

<script>
import NamedLink from '@/components/link/named-link'
import { createLeftMenus, createRightMenus } from './menus'
export default {
  name: 'navigator-bar',
  components: {
    NamedLink
  },
  computed: {
    leftMenus () {
      return createLeftMenus()
    },
    rightMenus () {
      return createRightMenus()
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    background: #fff;
    margin: 0 auto 10px;
    padding: 15px 20px;
  }

  .left {
    display: flex;
    flex: 1;
    .nav-link {
      display: block;
      cursor: pointer;
      min-width: 120px;
      line-height: 16px;
      text-align: center;
      color: @text-color;
      .icon {
        font-size: 32px;
        color: @link-color;
        margin-bottom: 5px;
      }
    }
  }

  .right {
    .nav-link {
      display: inline-block;
      color: @text-color;
      text-align: right;
      margin-left: 36px;
      font-size: @font-size-base;
      line-height: @line-height-computed;
      > span > * {
        display: inline;
      }

      .boo-icon {
        margin-right: 5px;
        font-size: @line-height-computed;
      }
    }
  }

  .download-item-link {
    color: @text-color;
  }

  .nav-link
  , .download-item-link {
    font-size: @font-size-base;
    padding: 0;
  }
</style>
