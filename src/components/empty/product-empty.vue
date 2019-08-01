<template>
  <Empty :image="emptyImg" :imageStyle="{ height: '120px' }">
    <template slot="description">
      <slot name="empty">
        暂无商品哦～
      </slot>
    </template>
  </Empty>
</template>
<script>
  import emptyImg from '@/assets/empty.jpg'

  export default {
    name: 'product-empty',
    computed: {
      emptyImg () {
        return emptyImg
      }
    }
  }
</script>
