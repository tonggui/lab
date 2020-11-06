<template>
  <div class="logo-container">
    <img :src="imgSrc" width="88"/>
    <div class="divider" />
  </div>
</template>

<script>
  import logo from '@/assets/cube-logo.png'

  export default {
    name: 'cube-logo',
    data () {
      return {
        imgSrc: logo
      }
    }
  }
</script>

<style lang="less" scoped>
  .logo-container {
    display: inline-block;
    height: 38px;
    //width: 88px;
    .divider {
      display: inline-block;
      height: 14px;
      width: 1px;
      background: #D9D9D9;
      margin: 0 16px;
      position: relative;
      bottom: 10px;
    }
  }
</style>
