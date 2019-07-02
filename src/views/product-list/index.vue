<template>
  <div class="list">
    <ListHeader></ListHeader>
    <ListContent class="content"></ListContent>
    <ListFooter></ListFooter>
  </div>
</template>

<script>
import ListHeader from './components/list-header'
import ListContent from './components/list-content'
import ListFooter from './components/list-footer'

export default {
  name: 'product-list',
  components: {
    ListHeader,
    ListContent,
    ListFooter
  }
}
</script>
<style scoped lang="less">
  .list {
    color: @primary-color;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .content {
    min-height: 600px;
    background: @content-bg;
  }
</style>
