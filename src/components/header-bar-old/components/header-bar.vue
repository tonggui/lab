<template>
  <div class="wrapper">
    <div class="left">
      <template v-for="(menu, index) in left">
        <transition :name="menu.transitionName" :key="index">
          <IconItem
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
