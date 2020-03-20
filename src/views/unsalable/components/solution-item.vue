<template>
  <div class="solution-item">
    <div class="item-title">{{ item.title }}</div>
    <div class="item-content"><slot>{{ item.content }}</slot></div>
  </div>
</template>

<script>
  export default {
    name: 'solution-item',
    props: {
      item: {
        type: Object,
        default: () => ({
          title: '',
          content: ''
        })
      }
    }
  }
</script>

<style lang='less'>
</style>
