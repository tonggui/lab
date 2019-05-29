<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body {
  background: @color-bg;
}
body {
  margin: 0 auto;
  padding: 0;
  min-width: 1024px;
  max-width: 1280px;
  color: @color-primary;
  font-size: 14px;
  font-family: Helvetica Neue,Arial,PingFang SC,microsoft yahei,STXihei;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
