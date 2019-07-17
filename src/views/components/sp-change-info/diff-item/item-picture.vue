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
    img {
      width: 90px;
      height: 90px;
      object-fit: contain;
      background: #fff;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
