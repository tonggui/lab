<template>
  <RouteLink
      class="nav-link"
      tag="Button"
      :to="menu.link||''"
      @click="handleClick($event, menu.bid)"
      :disabled="isDisabled"
  >
    <component :is="component" v-bind="tooltip">
      <template v-if="menu.children">
        <Dropdown trigger="hover" :visible="menu.initVisible">
          <Badge v-bind="badgeProps" class="link-item" :class="{ disabled: isDisabled }">
            <Icon class="icon" v-bind="getIconProps(icon)">
              <component v-if="isComponent(icon)" :is="icon" />
            </Icon>
            <div>{{menu.label}}</div>
          </Badge>
          <DropdownMenu slot="list" :id="menu && menu.menu && menu.menu.id">
            <DropdownItem v-for="(subMenu, idx) in menu.children" :key="idx" :id="subMenu.id">
              <Tooltip type="guide" v-bind="subMenu.tooltip ? subMenu.tooltip : { disabled: true }">
                <RouteLink
                    class="download-item-link"
                    tag="a"
                    :to="subMenu.link||''"
                    :disabled="!!subMenu.disabled"
                    @click="handleClickSubmenu(subMenu, subMenu.bid)"
                >
                  {{subMenu.label}}
                  <Tooltip v-bind="subMenu.questionTip" v-if="subMenu.questionTip">
                    <Icon local="question-circle" :size="14" />
                  </Tooltip>
                </RouteLink>
              </Tooltip>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </template>
      <template v-else>
        <Badge v-bind="badgeProps" class="link-item" :class="{ disabled: isDisabled }">
          <Icon class="icon" v-bind="getIconProps(icon)">
            <component v-if="isComponent(icon)" :is="icon" />
          </Icon>
          <div>{{menu.label}}</div>
        </Badge>
      </template>
    </component>
  </RouteLink>
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
.link-item {
  display: flex;
  align-items: center;
}
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
  text-align: left;
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
.download-item-link {
  color: @text-color;
  font-size: @font-size-base;
  padding: 0;
}
</style>
