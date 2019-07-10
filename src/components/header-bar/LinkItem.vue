<template>
  <Badge v-bind="badgeProps">
    <Link
      class="nav-link"
      :to="menu.link||''"
      @click="createCompatibleClickEventListener(menu.click)"
      :disabled="!!menu.disabled"
      :data-lx="`moduleClick('${menu.bid}')`"
    >
      <Icon class="icon" v-bind="getIconProps(menu.icon)">
        <component v-if="isComponent(menu.icon)" :is="menu.icon" />
      </Icon>
      <div>{{menu.label}}</div>
    </Link>
  </Badge>
</template>

<script>
  import Link from '@/components/link/link'
  import menuItemMixins from './menuItemMixins'

  export default {
    name: 'LinkItem',
    mixins: [menuItemMixins],
    components: {
      Link
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
    line-height: @line-height-computed;
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
