<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body {
  background: @body-background;
}
body {
  margin: 0 auto;
  padding: 0;
  min-width: 1024px;
  max-width: 1280px;
  color: @text-color;
  font-size: @font-size-base;
  line-height: @line-height-base;
  font-family: 'Avenir',Helvetica,'Helvetica Neue',Arial,sans-serif,PingFang SC,microsoft yahei,STXihei;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
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
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .boo-modal{
      top: 0;
  }
}
.danger {
  color: @error-color;
}
</style>
