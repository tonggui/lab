<template>
  <span class="flash-loading">
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath" d="M500,20 L870,20 L540,465 L860,465 L260,1004 L440,620 L170,620 L500,20" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
      <!--<path class="mypath" d="M500,20 L870,20 L540,465 L860,465 L305,1004 L215,1004 L440,620 L170,620 L500,20" stroke="#fdb32b" stroke-width="2" fill="none" stroke-dasharray="5" />-->
    </svg>
    <span style="margin-right: 30px;"></span>
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath1" d="M685,20 L500,20 L170,620 L440,620 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
      <path class="mypath1" d="M685,20 L870,20 L540,465 L860,465 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
    </svg>
    <span style="margin-right: 30px;"></span>
    <svg class="svg" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath2" d="M685,20 L500,20 L170,620 L440,620 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
      <path class="mypath2" d="M685,20 L870,20 L540,465 L860,465 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
    </svg>
    <span style="margin-right: 30px;"></span>
    <div class="wrapper">
      <div class="shadow"></div>
      <svg class="svg" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M500,20 L870,20 L540,465 L860,465 L260,1004 L440,620 L170,620 L500,20" stroke="#fdb32b" stroke-width="20" fill="#fdb32b" />
      </svg>
    </div>
    <!--<div><slot>Loading</slot></div>-->
  </span>
</template>

<script>
  export default {
    name: 'flash-loading',
    props: {},
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
    },
    mounted () {
      const path = document.querySelector('.mypath')
      const length = path.getTotalLength()
      console.log('path’s length: ' + length)
    }
  }
</script>

<style lang='less' scoped>
  @svg-size: 50px;
  .flash-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: @svg-size;
      height: @svg-size;
      .mypath {
        stroke: #fdb32b;
        stroke-width: 50;
        stroke-dasharray: 3566;
        stroke-dashoffset: 3566;
        fill: none;
        -webkit-animation: go 1s ease-in-out forwards infinite;
      }
      .mypath1 {
        stroke: #fdb32b;
        stroke-width: 50;
        stroke-dasharray: 3566;
        stroke-dashoffset: 3566;
        fill: none;
        -webkit-animation: go 1.5s ease-out forwards infinite;
      }
      @-webkit-keyframes go {
        0% {
          stroke-dashoffset: 3566;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      .mypath2 {
        stroke: #fdb32b;
        stroke-width: 50;
        stroke-dasharray: 3566;
        stroke-dashoffset: 3566;
        fill: none;
        -webkit-animation: fillit 1.5s ease-out forwards infinite;
      }
      @-webkit-keyframes fillit {
        0% {
          stroke-dashoffset: 3566;
          fill-opacity: 0;
        }
        70% {
          stroke-dashoffset: 0;
          fill-opacity: 0;
        }
        100% {
          stroke-dashoffset: 0;
          fill: #fdb32b;
          fill-opacity: 1;
        }
      }
    }
    .wrapper {
      position: relative;
      display: inline-block;
      width: @svg-size;
      height: @svg-size;
      .shadow {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: inline-block;
        width: 100%;
        height: @svg-size;
        background-color: white;
        -webkit-animation: fade 1s ease-in forwards infinite;
      }
    }
    @-webkit-keyframes fade {
      0% {
        top: 0;
        height: @svg-size;
      }
      50% {
        top: @svg-size;
        height: 0;
      }
      100% {
        top: @svg-size;
        height: 0;
      }
    }
  }
</style>
