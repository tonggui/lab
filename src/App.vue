<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: "Helvetica Neue", "Avenir", Arial, -apple-system,
    BlinkMacSystemFont, "PingFang SC", "microsoft yahei", "STXihei", sans-serif;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1024px;
  text-align: center;
  color: #2c3e50;
  overflow-x: auto;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
