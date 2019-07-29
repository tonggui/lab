<template>
  <div
    class="diff-picture-item"
    v-if="value"
  >
    <img
      v-for="(item, idx) in value"
      :key="idx"
      :src="item"
    />
  </div>
</template>

<script>
  export default {
    name: 'DiffPictureItem',
    props: {
      value: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped lang="less">
  .diff-picture-item {
    line-height: 0;
    // 与img的margin-bottom对冲
    margin-bottom: -10px;
    img {
      width: 85px;
      height: 85px;
      object-fit: contain;
      background: #fff;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
</style>
