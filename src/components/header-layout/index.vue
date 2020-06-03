<template>
  <div slot="header" class="header-layout-container">
    <slot name="left"></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
  export default {
    name: 'header-layout'
  }
</script>

<style scoped>
.header-layout-container {
  background: #fff;
  width: 100%;
  height: 59px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  padding: 0 20px;
  color: #36394D;
  line-height: 59px;
  border-bottom: 1px solid #E9EAF2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
