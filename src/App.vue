<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body {
  background: @body-background;
  height: 100%;
}
body {
  margin: 0 auto;
  padding: 0;
  min-width: 1024px;
  max-width: 1280px;
  color: @text-color;
  font-size: @font-size-base;
  line-height: @line-height-base;
  font-family: @font-family;
  -webkit-font-smoothing: initial;
}
#app {
  height: 100%;
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
.helper-text {
  color: @text-helper-color;
}
.desc-text {
  color: @text-description-color;
}
</style>
