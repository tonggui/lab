<template>
  <div class="wrapper">
    <div class="left">
      <IconItem
        v-for="(menu, index) in left"
        :key="index"
        :menu="menu"
        @click="handleClick"
        :disabled="disabled"
      />
    </div>
    <div class="right">
      <LinkItem
        v-for="(menu, index) in right"
        :key="index"
        :menu="menu"
        @click="handleClick"
        :disabled="disabled"
      />
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
