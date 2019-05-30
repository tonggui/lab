<template>
  <div class="wrapper">
    <div class="left">
      <NamedLink v-for="(menu, index) in leftMenus" :key="index" :name="menu.link" class="link">
        <template v-if="menu.subs">
          <Dropdown trigger="hover">
            <Icon class="icon"><component :is="menu.icon" /></Icon>
            <div>
              {{menu.label}}
              <Icon type="keyboard-arrow-down" />
            </div>
            <DropdownMenu v-slot:list>
              <DropdownItem v-for="(subMenu, idx) in menu.subs" :key="idx">
                <NamedLink :name="subMenu.link">{{subMenu.label}}</NamedLink>
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
  </div>
</template>

<script>
import NamedLink from '@/components/link/named-link'
import createMenus from './menus'
export default {
  name: 'navigator-bar',
  components: {
    NamedLink
  },
  computed: {
    leftMenus () {
      return createMenus()
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
    .link {
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
</style>
