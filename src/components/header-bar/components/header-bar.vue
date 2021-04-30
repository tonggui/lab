<template>
  <div class="wrapper">
    <div class="left">
      <template v-for="(menu, index) in left">
        <transition :name="menu.transitionName" :key="index">
          <IconItem
            v-if="!['新建单个商品', '从商品库新建'].includes(menu.label)"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
          <PermissionBtn
            v-else
            component="IconItem"
            btn-type="CREATE_EDIT"
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
      disabled: Boolean
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
  }

  .left {
    display: flex;
    flex: 1;
  }
</style>
