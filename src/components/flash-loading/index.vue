<template>
  <span class="flash-loading">
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath" d="M500,20 L870,20 L540,465 L860,465 L260,1004 L440,620 L170,620 L500,20" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
      <!--<path class="mypath" d="M500,20 L870,20 L540,465 L860,465 L305,1004 L215,1004 L440,620 L170,620 L500,20" stroke="#fdb32b" stroke-width="2" fill="none" stroke-dasharray="5" />-->
    </svg>
    <span style="margin-right: 60px;"></span>
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath1" d="M685,20 L500,20 L170,620 L440,620 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
      <path class="mypath1" d="M685,20 L870,20 L540,465 L860,465 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
    </svg>
    <span style="margin-right: 60px;"></span>
    <svg class="svg" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath2" d="M685,20 L500,20 L170,620 L440,620 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
      <path class="mypath2" d="M685,20 L870,20 L540,465 L860,465 L260,1024" stroke="#fdb32b" stroke-width="20" fill="none" stroke-dasharray="5" />
    </svg>
    <span style="margin-right: 60px;"></span>
    <div class="wrapper">
      <div class="shadow"></div>
      <svg class="svg" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M500,20 L870,20 L540,465 L860,465 L260,1004 L440,620 L170,620 L500,20" stroke="#fdb32b" stroke-width="20" fill="#fdb32b" />
      </svg>
    </div>
    <span style="margin-right: 60px;"></span>
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="mypath3" d="M600,25 L300,515 L710,515 L375,994" stroke="#fdb32b" stroke-width="20" fill="none" />
      <circle class="mycircle" cx="512" cy="512" r="472" stroke="#fdb32b" stroke-width="20" fill="none"/>
    </svg>
    <span style="margin-right: 60px;"></span>
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M600,25 L300,515 L710,515 L375,994" stroke="#fdb32b" stroke-width="80" fill="none" />
      <circle class="mycircle" cx="512" cy="512" r="472" stroke="#fdb32b" stroke-width="20" fill="none"/>
    </svg>
    <span style="margin-right: 60px;"></span>
    <div class="loading-text"><slot>Loading...</slot></div>
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
      // const path = document.querySelector('.mycircle')
      // const length = path.getTotalLength()
      // console.log('mycircle’s length: ' + length)
    }
  }
</script>

<style lang='less' scoped>
  @svg-size: 30px;
  @line-width: 80;
  @line-color: #fdb32b;
  @path-length1: 3566;
  @path-length2: 1590;
  @path-length3: 3154;
  .flash-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    .loading-text {
      color: @line-color;
    }
    .paths {
      stroke: @line-color;
      stroke-width: @line-width;
      fill: none;
    }
    svg {
      width: @svg-size;
      height: @svg-size;
      .mypath {
        .paths;
        stroke-dasharray: @path-length1;
        stroke-dashoffset: @path-length1;
        -webkit-animation: go 1s ease-in-out forwards infinite;
      }
      .mypath1 {
        .paths;
        stroke-dasharray: @path-length1;
        stroke-dashoffset: @path-length1;
        -webkit-animation: go 1.5s ease-out forwards infinite;
      }
      @-webkit-keyframes go {
        0% {
          stroke-dashoffset: @path-length1;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      .mypath2 {
        .paths;
        stroke-dasharray: @path-length1;
        stroke-dashoffset: @path-length1;
        -webkit-animation: fillit 1.5s ease-out forwards infinite;
      }
      @-webkit-keyframes fillit {
        0% {
          stroke-dashoffset: @path-length1;
          fill-opacity: 0;
        }
        70% {
          stroke-dashoffset: 0;
          fill-opacity: 0;
        }
        100% {
          stroke-dashoffset: 0;
          fill: @line-color;
          fill-opacity: 1;
        }
      }
      .mypath3 {
        .paths;
        stroke-dasharray: @path-length2;
        stroke-dashoffset: @path-length2;
        -webkit-animation: drawflash 1.5s ease-out forwards infinite;
      }
      @-webkit-keyframes drawflash {
        0% {
          stroke-dashoffset: @path-length2;
        }
        75% {
          stroke-dashoffset: 0;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      .mycircle {
        .paths;
        stroke-dasharray: @path-length3;
        stroke-dashoffset: @path-length3;
        transform: matrix(0,-1,1,0,0,1024);
        -webkit-animation: drawcircle 1.5s ease-out forwards infinite;
      }
      @-webkit-keyframes drawcircle {
        0% {
          stroke-dashoffset: @path-length3;
        }
        75% {
          stroke-dashoffset: 0;
        }
        100% {
          stroke-dashoffset: 0;
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
