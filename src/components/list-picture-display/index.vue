<template>
  <span class="list-picture-display" :style="styles">
    <img v-if="!!src" :src="src" alt="图片" :width="size" :height="size">
    <Icon v-else local="picture" :size="iconSize" :color="color" />
  </span>
</template>

<script>
  export default {
    name: 'list-picture-display',
    props: {
      src: { // 图片url
        type: String,
        default: ''
      },
      size: { // 展示大小
        type: [Number, String],
        default: 80
      },
      iconSize: { // 代替的图标大小
        type: [Number, String],
        default: 22
      },
      color: String
    },
    computed: {
      styles () {
        let style = {}

        style['width'] = `${+this.size + 2}px`
        style['height'] = `${+this.size + 2}px`

        return style
      }
    }
  }
</script>

<style lang='less'>
  .list-picture-display {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e9eaf2;
    background-color: #f7f8fa;
    margin: 7px 0;
  }
</style>
