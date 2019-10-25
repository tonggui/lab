<template>
  <span class="flash-loading">
    <svg class="svg" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <circle cx="512" cy="512" r="472" stroke="#eeeeee" stroke-width="70" fill="none"/>
    </svg>
    <svg class="svg load" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <circle class="loading" cx="512" cy="512" r="472" stroke="#F8B500" stroke-width="70" fill="none" />
    </svg>
    <svg class="svg" width="1024" height="1024" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path class="flash" d="M480,200 L740,200 L500,465 L760,465 L330,844 L440,580 L230,580 L480,200" stroke="#d5d5d5" stroke-width="20" fill="#d5d5d5" />
    </svg>
  </span>
</template>

<script>
  export default {
    name: 'flash-loading',
    mounted () {
      // const path = document.querySelector('.loading')
      // const length = path.getTotalLength()
      // console.log('loading’s length: ' + length)
    }
  }
</script>

<style lang='less' scoped>
  @svg-size: 36px;
  @path-loading: 2966;
  @gray-weak: #eee;
  @theme-color: #F8B500;

  .flash-loading {
    position: relative;
    .svg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: @svg-size;
      height: @svg-size;
      @keyframes dash {
        0% {
          stroke-dasharray: 1, @path-loading;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 1928, @path-loading;
          stroke-dashoffset: -742;
        }
        100% {
          stroke-dasharray: 1928, @path-loading;
          stroke-dashoffset: -2966;
        }
      }
      .loading {
        animation: dash 1.5s linear infinite;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      &.load {
        animation: rotate 2s linear infinite;
      }
      @keyframes colorfade {
        0% {
          fill: @gray-weak;
          stroke: @gray-weak;
        }
        60% {
          fill: @theme-color;
          stroke: @theme-color;
        }
        100% {
          fill: @gray-weak;
          stroke: @gray-weak;
        }
      }
      .flash {
        animation: colorfade 1.5s linear infinite;
      }
    }
  }
</style>
