<template>
  <div class="wrapper">
    <div class="left">
      <IconItem
        v-for="(menu, index) in left"
        :key="index"
        :menu="menu"
      />
    </div>
    <div class="right">
      <LinkItem
        v-for="(menu, index) in right"
        :key="index"
        :menu="menu"
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
    right: Array
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    background: #fff;
    margin: 0 0 10px;
    padding: 15px 20px;
  }

  .left {
    display: flex;
    flex: 1;
  }
</style>
