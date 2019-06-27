<template>
  <div id="demo">
    <h1></h1>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'demo'
}
</script>

<style scoped lang="less">
  h1 {
    color: #999;
  }
</style>
