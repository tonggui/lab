<template>
  <div class="wrapper">
    <div class="left">
      <template v-for="(menu, index) in left">
        <transition :name="menu.transitionName" :key="index">
          <IconItem
            v-if="!['新建单个商品', '从商品库新建'].includes(menu.label)"
            :need-permission="needPermission"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
          <PermissionBtn
            v-else
            component="IconItem"
            :need-permission="needPermission"
            btn-type="CREATE"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
        </transition>
      </template>
    </div>
    <div class="right">
      <template v-for="(menu, index) in right">
        <transition :name="menu.transitionName" :key="index">
          <LinkItem
            v-if="menu.label !== '回收站'"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
          <PermissionBtn
            v-else
            component="LinkItem"
            :need-permission="needPermission"
            btn-type="RECYCLE_BIN"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
        </transition>
      </template>
    </div>
  </div>
</template>

<script>
  import IconItem from './IconItem'
  import LinkItem from './LinkItem'

  export default {
    name: 'header-bar',
    components: {
      IconItem,
      LinkItem
    },
    props: {
      left: Array,
      right: Array,
      disabled: Boolean,
      needPermission: Boolean
    },
    methods: {
      handleClick (menu) {
        this.$emit('click', menu)
      }
    }
  }
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 15px 20px;
    justify-content: space-between;
  }

  .left {
    display: flex;
    flex: 1;
  }
  .right {
    display: flex;
    //flex: 1;
  }
</style>
