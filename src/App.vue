<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body {
  background: @color-bg;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0 auto;
  padding: 0;
  min-width: 1024px;
  max-width: 1280px;
  color: @color-primary;
  font-size: 14px;
  font-family: 'Avenir',Helvetica,'Helvetica Neue',Arial,sans-serif,PingFang SC,microsoft yahei,STXihei;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
}
#app {
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
